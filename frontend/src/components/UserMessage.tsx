type Props = {
  content: string;
};

export const UserMessage = ({ content }: Props) => {
  return (
    <div className="w-full flex justify-end mb-4">
      <div className="prose dark:prose-invert font-light px-4 py-2 bg-[#2f2f2f] text-white rounded-t-xl rounded-bl-xl max-w-[75%] ml-auto">
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};