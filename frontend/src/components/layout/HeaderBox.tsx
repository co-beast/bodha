import { Brand } from "./Brand";

type Props = {
    isVisible: boolean;
};

export const HeaderBox = ({ isVisible: isVisible }: Props) => {
    if (!isVisible) return null;

    return (
        <header className="p-4 border-b border-gray-800 text-center shadow-sm shadow-black/20">
            <Brand size="sm" />
        </header>
    );
}