import type { ChatMessage } from "../types/chat";
import { ChatMessageBubble } from "./ChatMessageView";

type Props = {
  messages: ChatMessage[];
  loading: boolean;
};

export const ChatMessages = ({ messages, loading }: Props) => {
  return (
    <div className="space-y-2">
      {messages.length === 0 ? (
        <p className="text-gray-500">Start the conversation...</p>
      ) : (
        messages.map((message, index) => (
          <ChatMessageBubble
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

export default ChatMessages;