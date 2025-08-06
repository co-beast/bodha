import type { ChatMessage } from "../types/chat";
import { ChatMessageView } from "./ChatMessageView";

type Props = {
  messages: ChatMessage[];
  loading: boolean;
};

export const ChatBoxView = ({ messages, loading }: Props) => {
  return (
    <div className="space-y-2">
      {messages.length === 0 ? (
        <p className="text-gray-400">Start the conversation...</p>
      ) : (
        messages.map((message, index) => (
          <ChatMessageView
            key={index}
            role={message.role}
            content={message.content}
          />
        ))
      )}
      {loading && <p className="text-gray-500">Assistant is typing...</p>}
    </div>
  );
};

export default ChatBoxView;