import incognito from "@/shared/assets/incognito.png";

type Props = {
    size?: "sm" | "lg";
};

export const Brand = ({ size }: Props) => {
    const isLarge = size === "lg";

    return (
        <h1 className={`${isLarge ? "text-2xl" : "text-xl"} font-light flex items-center justify-center text-[#ececf1] gap-3`}>
            <img src={incognito} alt="Private" className={`object-contain ${isLarge ? "w-10 h-10" : "w-8 h-8"}`} />
            <span>Private ChatGPT</span>
        </h1>
    );
};