import { Roles } from "../types/chat";
import ReactMarkdown from "react-markdown";

type Props = {
    role: 'user' | 'assistant';
    content: string;
};

export const ChatMessageView = ({ role, content } : Props) => {

    const isUser = role === Roles.USER;

    return (
        <div className={`w-full flex dark ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`prose dark:prose-invert px-4 py-2 ${isUser ? "bg-[#2f2f2f] text-white rounded-xl max-w-[75%] ml-auto" : "w-full text-[#ececf1] max-w-none mb-8"}`}>
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </div>
    );
};