import { useChat } from "./features/chat/hooks/useChat";

import { ConversationBox } from "@/features/chat/components/conversation/ConversationBox";
import { HeaderBox } from "@/shared/components/HeaderBox";
import { WelcomeScreen } from '@/features/chat/components/WelcomeScreen.tsx';
import { ChatInputBox } from "@/features/chat/components/input/ChatInputBox";

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