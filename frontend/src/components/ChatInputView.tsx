import { useRef, useEffect, useState } from "react";

type Props = {
    onSend: (message: string) => void;
    loading: boolean;
};

export const ChatInputView = ({ onSend, loading }: Props) => {
    const [input, setInput] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; 
        }
    }, [input]);

    const handleSend = () => {
        if (input.trim()) {
            onSend(input);
            setInput("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex items-end gap-2 bg-[#2f2f2f] p-2 rounded-xl shadow-md">
            <textarea
                ref={textAreaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 resize-none bg-transparent outline-none text-white placeholder-gray-400 p-2 max-h-48 overflow-y-auto"
                disabled={loading}
            />
        </div>
    );
};
