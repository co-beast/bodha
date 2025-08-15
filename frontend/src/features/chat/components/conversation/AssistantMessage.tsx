import ReactMarkdown from "react-markdown";

type Props = {
    content: string;
};

export const AssistantMessage = ({ content }: Props) => {
    return (
        <div className="w-full flex dark justify-start mb-8">
            <div className="prose dark:prose-invert font-light text-[#ececf1] px-4 py-2 w-full max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </div>
    );
};
