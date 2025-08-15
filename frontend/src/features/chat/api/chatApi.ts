import { API_BASE_URL } from "@/config";

const SSE_PREFIX = "data: ";
const SSE_EVENT_DELIMITER = "\n\n";
const ESCSAPED_NEWLINE_PATTERN = /\\n/g;

/**
 * Sends a user message to the backend and streams the assistant's reply token by token.
 */
export async function* streamAssistantReply(message: string): AsyncGenerator<string> {
  const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for session management
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message stream");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Failed to get reader from response body");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Decode the chunk to string and append to buffer
    buffer += decoder.decode(value, { stream: true });

    // SSE separates events with double newlines
    const events = buffer.split(SSE_EVENT_DELIMITER);
    buffer = events.pop() || ""; // buffer keeps partial SSE chunks between reads

    for (const event of events) {
      if (!event.startsWith(SSE_PREFIX)) continue;
      const token = event.replace(SSE_PREFIX, "").replace(ESCSAPED_NEWLINE_PATTERN, "\n");
      if (token) yield token;
    }
  }
}

/**
 * Clears the current chat session on the backend, resetting conversation history.
 */
export const resetChat = async () => {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "DELETE",
    credentials: "include", // Include cookies for session management
  });

  if (!response.ok) {
    throw new Error("Failed to reset chat");
  }

  return response.json();
};