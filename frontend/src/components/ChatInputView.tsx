import { useState } from "react";

type Props = {
    onSend: (message: string) => void;
    loading: boolean;
};

export const ChatInputView = ({ onSend, loading }: Props) => {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim()) {
            onSend(input);
            setInput("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !loading) {
            handleSend();
        }
    };

    return (
        <div className="flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded"
                disabled={loading}
                style={{ color: "black" }}
            />
            <button
                onClick={handleSend}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? "Sending..." : "Send"}
            </button>
        </div>
    );
};
