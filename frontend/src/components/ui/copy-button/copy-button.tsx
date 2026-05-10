import { useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";

type PropsType = {
    text: string;
}

export function CopyButton({ text }: PropsType) {
    // コピー完了状態
    const [isCopied, setIsCopied] = useState(false);

    /** クリップボードにテキストをコピーし、2秒後に状態をリセットする */
    async function handleClick() {
        if (isCopied) {
            return;
        }
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="コピー"
        >
            {isCopied
                ? <LuCheck className="size-4 text-green-500" />
                : <LuCopy className="size-4" />
            }
        </button>
    );
}
