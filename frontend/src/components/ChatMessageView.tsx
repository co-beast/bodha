import { Roles } from "../types/chat";
import ReactMarkdown from "react-markdown";

type Props = {
    role: 'user' | 'assistant';
    content: string;
};

export const ChatMessageView = ({ role, content } : Props) => {

    const isUser = role === Roles.USER;

    return (
        <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`whitespace-pre-wrap ${isUser ? "bg-[#2f2f2f] text-white rounded-xl px-4 py-2 max-w-[75%]" : "w-full text-[#ececf1] px-4 py-2"}`}>
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </div>
    );
};