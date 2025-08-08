import { useChat } from "./hooks/useChat";

import { ConversationBox } from "./components/chat/conversation/ConversationBox";
import { HeaderBox } from "./components/layout/HeaderBox";
import { WelcomeScreen } from "./components/chat/WelcomeScreen";
import { ChatInputBox } from "./components/chat/input/ChatInputBox";

function App() {
  const { messages, loading, handleSend } = useChat();
  const hasChatHistory = messages.length > 0;

  return (
    <div className="flex flex-col h-screen bg-[#212121] text-[#ececf1]">
      <HeaderBox isVisible={hasChatHistory} />

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {hasChatHistory ? <ConversationBox messages={messages} /> : <WelcomeScreen onSend={handleSend} loading={loading} />}
        </div>
      </main>

      <ChatInputBox isVisible={hasChatHistory} onSend={handleSend} loading={loading} />
    </div>
  );
}

export default App;