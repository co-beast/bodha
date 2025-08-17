import { HttpStatusCode } from "axios";
import * as sut from "@/controllers/chatController";

const SSE_DATA_PREFIX = "data: ";
const SSE_EVENT_END = "event: end";
const SSE_DELIMITER = "\n\n";

const tokens = ["Reply ", "from as", "sistant!"];

const mockStreamChatSuccess = async function* (_conversation: any[]) {
    for (const token of tokens) {
        yield token;
    }
};

const mockStreamChatError = async function* (_conversation: any[]) {
    throw new Error("Stream failed");
};

// We’ll mock streamChat dynamically inside tests
jest.mock("../../src/services/chatService", () => ({
    streamChat: jest.fn(),
}));

describe("chatController", () => {
    let request: any;
    let response: any;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn(() => ({ json: jsonMock }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("handleChatMessage", () => {
        beforeEach(() => {
            request = {
                body: { message: "Message from user" },
                session: { conversation: [] },
            };

            response = {
                setHeader: jest.fn(),
                write: jest.fn(),
                end: jest.fn(),
                status: statusMock,
            };
        });

        test("should stream assistant reply and update session", async () => {

            const { streamChat } = require("../../src/services/chatService");
            streamChat.mockImplementation(() => mockStreamChatSuccess([]));

            await sut.handleChatMessage(request, response);

            // Verify headers
            expect(response.setHeader).toHaveBeenCalledWith("Content-Type", "text/event-stream");
            expect(response.setHeader).toHaveBeenCalledWith("Cache-Control", "no-cache");
            expect(response.setHeader).toHaveBeenCalledWith("Connection", "keep-alive");

            // Verify SSE writes
            tokens.forEach(token => {
                expect(response.write).toHaveBeenCalledWith(`${SSE_DATA_PREFIX}${token}${SSE_DELIMITER}`);
            });
            expect(response.write).toHaveBeenCalledWith(`${SSE_EVENT_END}\n${SSE_DATA_PREFIX}${SSE_DELIMITER}`);

            // Verify session update
            expect(request.session.conversation.length).toBe(2);
            expect(request.session.conversation[0].role).toBe("user");
            expect(request.session.conversation[0].content).toBe("Message from user");
            expect(request.session.conversation[1].role).toBe("assistant");
            expect(request.session.conversation[1].content).toBe("Reply from assistant!");

            expect(response.end).toHaveBeenCalled();
        });

        test("should initialize conversation the first time", async () => {
            request.session.conversation = undefined;

            const { streamChat } = require("../../src/services/chatService");
            streamChat.mockImplementation(() => mockStreamChatSuccess([]));

            await sut.handleChatMessage(request, response);

            expect(request.session.conversation.length).toBe(2);
            expect(request.session.conversation[0].role).toBe("user");
            expect(request.session.conversation[0].content).toBe("Message from user");
            expect(request.session.conversation[1].role).toBe("assistant");
            expect(request.session.conversation[1].content).toBe("Reply from assistant!");

            expect(response.end).toHaveBeenCalled();
        });

        test("should return 400 if message is missing", async () => {
            request.body.message = undefined;

            await sut.handleChatMessage(request, response);

            expect(response.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest);
            expect(response.status().json).toHaveBeenCalledWith({ error: "Message is required" });
        });

        test("should return 500 if streamChat throws", async () => {
            const { streamChat } = require("../../src/services/chatService");
            streamChat.mockImplementation(() => mockStreamChatError([]));

            await sut.handleChatMessage(request, response);

            expect(response.status).toHaveBeenCalledWith(HttpStatusCode.InternalServerError);
            expect(response.status().json).toHaveBeenCalledWith({ error: "Failed to get response" });
        });
    });

    describe("handleClearChat", () => {
        beforeEach(() => {
            request = {
                session: {
                    conversation: [
                        { role: "user", content: "User Message 1" },
                        { role: "assistant", content: "Assistant Reply 1" },
                    ],
                },
            };

            response = {
                json: jsonMock,
                status: statusMock,
            };
        });

        test("should clear conversation", () => {
            sut.handleClearChat(request, response);

            expect(request.session.conversation).toEqual([]);
            expect(response.json).toHaveBeenCalledWith({ message: "Chat session cleared successfully." });
        });

        test("should return 400 if session is missing", () => {
            request.session = undefined;

            sut.handleClearChat(request, response);

            expect(response.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest);
            expect(response.status().json).toHaveBeenCalledWith({ error: "No session found." });
        });
    });
});
