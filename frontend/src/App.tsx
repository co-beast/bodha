import { useState } from "react";

import { ChatInput } from "./components/ChatInput";
import { ChatMessages } from "./components/ChatBox";

import { sendMessage } from "./api/chat";
import { Roles, type ChatMessage } from "./types/chat";

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (message: string) => {    
    
    const userMessage: ChatMessage = { 
      role: Roles.USER, 
      content: message 
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const assistantReply = await sendMessage(message);
      const assistantMessage: ChatMessage = {
        role: Roles.ASSISTANT,
        content: assistantReply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      // TODO: Handle error (e.g., show a notification)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Private ChatGPT</h1>
      <ChatMessages messages={messages} loading={loading} />
      <ChatInput onSend={handleSend} loading={loading} />
    </div>
  );
}

export default App;
