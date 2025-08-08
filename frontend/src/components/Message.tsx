import { Roles } from "../types/chat";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";

type Props = {
    role: 'user' | 'assistant';
    content: string;
};

export const Message = ({ role, content } : Props) => {
    return role === Roles.USER ? <UserMessage content={content} /> : <AssistantMessage content={content} />;
};