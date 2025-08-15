import { useRef, useState } from "react";
import { useAutoResizeTextArea } from "@/features/chat/hooks/useAutoResizeTextArea";
import { SendButton } from "@/features/chat/components/input/SendButton";

type Props = {
    onSend: (message: string) => void;
    loading: boolean;
};

export const ChatInput = ({ onSend, loading }: Props) => {
    const [input, setInput] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    useAutoResizeTextArea(textAreaRef, input);

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
                className="flex-1 resize-none bg-transparent outline-none font-light text-white placeholder-gray-400 p-2 max-h-48 overflow-y-auto"
                disabled={loading}
            />
            <SendButton onClick={handleSend} disabled={loading || !input.trim()} />
        </div>
    );
};
