import * as sut from "@/services/chatService";

const tokens = ["Hello ", "world", "!"];

jest.mock("@/clients/ollamaClient", () => ({
    chat: jest.fn(async function* () {
        for (const token of tokens) {
            yield token;
        }
    }),
}));

describe("chatService streamChat", () => {
    test("should yield all tokens from ollamaChat", async () => {
        const conversation: ChatMessage[] = [
            { role: "user", content: "Hi" }
        ];

        const result: string[] = [];
        for await (const token of sut.streamChat(conversation)) {
            result.push(token);
        }

        expect(result).toEqual(tokens);
    });
});
