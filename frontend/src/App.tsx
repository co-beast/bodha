import { useState, useEffect } from "react";

import { ChatInputView } from "./components/ChatInputView";
import { ChatBoxView } from "./components/ChatBoxView";

import { sendMessageStream, resetChat } from "./api/chat";
import { Roles, type ChatMessage } from "./types/chat";

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const result = await resetChat();
        console.log(`${result}`);
      } catch (error) {
        console.error("Error resetting chat:", error);
      }
    };

    init();
  }, []);

  const handleSend = async (message: string) => {

    const userMessage: ChatMessage = { 
      role: Roles.USER, 
      content: message 
    };

    const assistantMessage: ChatMessage = {
      role: Roles.ASSISTANT,
      content: "",
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setLoading(true);

    // Start streaming the assistant's response
    try {
      let fullResponse = "";
      for await (const token of sendMessageStream(message)) {
        fullResponse += token;
        
        setMessages((prev) => {

          const lastIndex = prev.length - 1;
          if (prev[lastIndex].role !== Roles.ASSISTANT) { // ensure we are updating the assistant's message
            return prev; 
          }

          const updatedMessages = [...prev];
          updatedMessages[lastIndex] = {
            ...updatedMessages[lastIndex],
            content: fullResponse,
          };
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // TODO: Handle error state, e.g., show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Private ChatGPT</h1>
      <ChatBoxView messages={messages} loading={loading} />
      <ChatInputView onSend={handleSend} loading={loading} />
    </div>
  );
}

export default App;
