import { useEffect, useState } from "react";
import { sendMessageStream, resetChat } from "@/features/chat/api/chat";
import { Roles, type ChatMessage } from "@/features/chat/types/chat";

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    // Reset the chat on first load
    useEffect(() => {
        const init = async () => {
            try {
                const result = await resetChat();
                console.log(`${result}`);
            } catch (error) {
                console.error("Error resetting chat:", error);
            }
        };
        init();
    }, []);

    const handleSend = async (message: string) => {
        const userMessage: ChatMessage = {
            role: Roles.USER,
            content: message
        };

        const assistantMessage: ChatMessage = {
            role: Roles.ASSISTANT,
            content: "",
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);
        setLoading(true);

        // Start streaming the assistant's response
        try {
            let fullResponse = "";
            for await (const token of sendMessageStream(message)) {
                fullResponse += token;

                setMessages((prev) => {
                    const lastIndex = prev.length - 1;
                    if (prev[lastIndex].role !== Roles.ASSISTANT) { // ensure we are updating the assistant's message
                        return prev;
                    }

                    const updatedMessages = [...prev];
                    updatedMessages[lastIndex] = {
                        ...updatedMessages[lastIndex],
                        content: fullResponse,
                    };
                    return updatedMessages;
                });
            }
        } catch (error) {
            console.error("Error during message streaming:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        messages,
        loading,
        handleSend,
    };
}