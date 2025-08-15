import { useEffect } from "react";

export const useAutoResizeTextArea = (
    textAreaRef: React.RefObject<HTMLTextAreaElement | null>, 
    value: string) => {

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [textAreaRef, value]);
};