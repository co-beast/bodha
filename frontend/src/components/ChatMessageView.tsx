import { Roles } from "../types/chat";

type Props = {
    role: 'user' | 'assistant';
    content: string;
};

export const ChatMessageView = ({ role, content } : Props) => {

    const isUser = role === Roles.USER;

    const alignmentClass = isUser ? 'text-right' : 'text-left';
    const backgroundClass = isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black';

    return (
        <div className={`mb-2 ${alignmentClass}`}>
            <span className={`inline-block px-3 py-1 rounded ${backgroundClass}`}>
                {content}
            </span>
        </div>
    );
};