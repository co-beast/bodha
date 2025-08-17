import * as sut from "../../src/clients/ollamaClient";
import http, { IncomingMessage } from "http";

jest.mock("http");

describe("ollamaClient chat", () => {
    const mockHttpRequest = http.request as jest.Mock;

    const makeMockResponse = (chunks: string[]) => {
        const mockResponse = {
            setEncoding: jest.fn(),
            [Symbol.asyncIterator]: async function* () {
                for (const chunk of chunks) {
                    yield chunk;
                }
            }
        } as unknown as IncomingMessage;
        return mockResponse;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("yields tokens correctly for multiple chunks", async () => {
        const chunks = [
            JSON.stringify({ message: { content: "Hello ", done: false } }) + "\n",
            JSON.stringify({ message: { content: "World!", done: true } }) + "\n",
        ];

        mockHttpRequest.mockImplementation((_options, callback) => {
            const response = makeMockResponse(chunks);
            process.nextTick(() => callback(response));
            return {
                write: jest.fn(),
                end: jest.fn(), 
                on: jest.fn(),
            };
        });

        const messages: ChatMessage[] = [{ role: "user", content: "Hi" }];
        const result: string[] = [];

        for await (const token of sut.chat(messages)) {
            result.push(token);
        }

         expect(result).toEqual(["Hello ", "World!"]);
         expect(mockHttpRequest).toHaveBeenCalled();
    });

    test("skips malformed or empty JSON chunks", async () => {
        const mockHttpRequest = http.request as jest.Mock;

        // chunks: first valid, then empty string, then malformed JSON, then another valid
        const chunks = [
            JSON.stringify({ message: { content: "Hello " } }) + "\n",
            "\n",                        // empty chunk
            "{ invalid json }" + "\n",   // malformed chunk
            JSON.stringify({ message: { content: "World!" } }) + "\n"
        ];

        mockHttpRequest.mockImplementation((_options, callback) => {
            const mockResponse = {
                setEncoding: jest.fn(),
                [Symbol.asyncIterator]: async function* () {
                    for (const chunk of chunks) {
                        yield chunk;
                    }
                }
            } as unknown as IncomingMessage;

            process.nextTick(() => callback(mockResponse));

            return {
                write: jest.fn(),
                end: jest.fn(),
                on: jest.fn(),
            };
        });

        const messages: ChatMessage[] = [{ role: "user", content: "Hi" }];
        const result: string[] = [];

        for await (const token of sut.chat(messages)) {
            result.push(token);
        }

        expect(result).toEqual(["Hello ", "World!"]);
        expect(mockHttpRequest).toHaveBeenCalled();
    });


    test("throws if http.request emits an error", async () => {
        const mockHttpRequest = http.request as jest.Mock;
        const errorMessage = "Network error";

        mockHttpRequest.mockImplementation(() => {
            return {
                write: jest.fn(),
                end: jest.fn(),
                on: (event: string, callback: Function) => {
                    if (event == "error") {
                        // simulate request error
                        process.nextTick(() => callback(new Error(errorMessage)));
                    }
                },
            };
        });

        const messages: ChatMessage[] = [{ role: "user", content: "Hi" }];

        await expect(async () => {
            const result: string[] = [];
            for await (const token of sut.chat(messages)) {
                result.push(token);
            }
        }).rejects.toThrow(errorMessage);
    });
});
