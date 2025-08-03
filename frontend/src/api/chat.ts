export const sendMessage = async (message: string) => {
  const response = await fetch("http://localhost:8000/chat", {
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

export const resetChat = async () => {
  const response = await fetch("http://localhost:8000/reset", {
    method: "POST",
    credentials: "include", // Include cookies for session management
  });

  if (!response.ok) {
    throw new Error("Failed to reset chat");
  }

  return response.json();
};