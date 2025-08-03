/**
 * Sends a message to the backend and returns the assistant's reply.
 * @param {string} message - The user message to send
 * @returns {Promise<string>} The assistant's reply
 */
export const sendMessage = async (message: string) => {
  const response = await fetch("http://localhost:8000/chat/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for session management
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  const data = await response.json();
  return data.assistantReply;
};

/**
 * Sends a message to the backend and yields streamed tokens from the assistant.
 * The backend uses Server-Sent Events (SSE) to stream each token like:
 * 
 *   data: Hello
 *
 *   data: World
 *
 * This function reads the stream, extracts `data: ` lines, and yields each token.
 *
 * @param {string} message - The user message to send
 * @returns {AsyncGenerator<string>} Streamed assistant response tokens
 */
export async function* sendMessageStream(message: string): AsyncGenerator<string> {
  const response = await fetch("http://localhost:8000/chat/message/stream", {
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

  const decoder = new TextDecoder();
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Failed to get reader from response body");
  }

  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Decode the chunk to string and append to buffer
    buffer += decoder.decode(value, { stream: true });

    // SSE separates events with double newlines
    const eventLines = buffer.split("\n\n");
    buffer = eventLines.pop() || ""; // Keep the last incomplete chunk in buffer

    for (const eventLine of eventLines) {
      if (!eventLine.startsWith("data: ")) continue; // Skip lines that don't start with "data: "

      const token = eventLine.replace("data: ", "").replace(/\\n/g, "\n");
      if (token) yield token;
    }
  }
}

/**
 * Resets the chat session by sending a DELETE request to the backend.
 * This clears the chat history and resets the conversation state.
 *
 * @returns {Promise<void>} A promise that resolves when the chat is reset
 */
export const resetChat = async () => {
  const response = await fetch("http://localhost:8000/chat", {
    method: "DELETE",
    credentials: "include", // Include cookies for session management
  });

  if (!response.ok) {
    throw new Error("Failed to reset chat");
  }

  return response.json();
};