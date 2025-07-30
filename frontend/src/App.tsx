import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return; // Prevent sending empty messages
    
    const newMessage: ChatMessage = { 
      role: "user", 
      content: input 
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "message": newMessage.content }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.assistantReply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Private ChatGPT</h1>

      <div className="border p-3 rounded min-h-[200px] mb-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500">Start the conversation...</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <span className={`inline-block px-3 py-1 rounded ${msg.role === "user" ? "bg-blue-100" : "bg-green-100"}`}>
                {msg.content}
              </span>
            </div>
          ))
        )}
        {loading && <p className="text-gray-500">Assistant is typing...</p>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
