import { ChatInput } from "@/features/chat/components/input/ChatInput";

type Props = {
    isVisible: boolean;
    onSend: (message: string) => void;
    loading: boolean;
};

export const ChatInputBox = ({ isVisible, onSend, loading }: Props) => {
    if (!isVisible) return null;

    return (
        <footer className="p-4">
            <div className="max-w-3xl mx-auto align-items-center">
                <ChatInput onSend={onSend} loading={loading} />
            </div>
        </footer>
    );
};