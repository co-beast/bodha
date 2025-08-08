import { PaperPlaneIcon } from "@radix-ui/react-icons";

type Props = {
    onClick: () => void;
    disabled?: boolean;
};

export const SendButton = ({ onClick, disabled = false }: Props) => {
    return (
        <button
            className="p-3 rounded-lg transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClick}
            disabled={disabled}
            aria-label="Send message"
        >
            <PaperPlaneIcon className="w-5 h-5 text-white" />
        </button>
    );
};