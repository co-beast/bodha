import { useState, useEffect } from "react";

import { ChatInputView } from "./components/ChatInputView";
import { ChatBoxView } from "./components/ChatBoxView";

import { sendMessage, resetChat } from "./api/chat";
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
      <ChatBoxView messages={messages} loading={loading} />
      <ChatInputView onSend={handleSend} loading={loading} />
    </div>
  );
}

export default App;
