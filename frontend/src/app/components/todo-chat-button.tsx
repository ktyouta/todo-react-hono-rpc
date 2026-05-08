import { HiOutlineChatBubbleLeftEllipsis } from 'react-icons/hi2';

type PropsType = {
    // ドロワー開閉フラグ
    isOpen: boolean;
    onClick(): void;
};

export function TodoChatButton({ isOpen, onClick }: PropsType) {
    if (isOpen) return null;

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label="AIチャットを開く"
            className="fixed bottom-3 right-6 z-50 flex items-center justify-center w-11 h-11 rounded-lg bg-cyan-500 text-white shadow-md [@media(hover:hover)]:hover:bg-cyan-600 transition-colors"
        >
            <HiOutlineChatBubbleLeftEllipsis className="size-5" />
        </button>
    );
}
