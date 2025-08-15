import { ChatInput } from "@/features/chat/components/input/ChatInput";
import { Brand } from "@/shared/components/Brand";

type Props = {
    onSend: (message: string) => void;
    loading: boolean;
};

export const WelcomeScreen = ({ onSend, loading }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center gap-6">
            <Brand size="lg" />
            <div className="w-full">
                <ChatInput onSend={onSend} loading={loading} />
            </div>
        </div>
    );
};