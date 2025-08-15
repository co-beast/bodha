import { Roles } from "@/features/chat/types/chat";
import { UserMessage } from "@/features/chat/components/conversation/UserMessage";
import { AssistantMessage } from "@/features/chat/components/conversation/AssistantMessage";

type Props = {
    role: 'user' | 'assistant';
    content: string;
};

export const Message = ({ role, content } : Props) => {
    return role === Roles.USER ? <UserMessage content={content} /> : <AssistantMessage content={content} />;
};