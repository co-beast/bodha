import { chat as ollamaChat } from "../clients/ollamaClient";

/**
 * Streams a chat response from the Ollama service for the given conversation.
 */
export async function* streamChat(conversation: ChatMessage[]) {
    yield* ollamaChat(conversation);
}