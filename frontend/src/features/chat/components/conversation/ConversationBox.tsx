import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/features/chat/types/chat";
import { Message } from "@/features/chat/components/conversation/Message";

type Props = {
  messages: ChatMessage[];
};

export const ConversationBox = ({ messages }: Props) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-2">
      {messages.map((message, index) => (
        <Message key={index} role={message.role} content={message.content} />
      ))}

      <div ref={endOfMessagesRef} className="h-0" />
    </div>
  );
};

export default ConversationBox;