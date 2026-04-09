import { Button } from "@/components";
import { Dialog } from "@/components/ui/dialog/dialog";

type PropsType = {
    isOpen: boolean;
    selectedCount: number;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export function UserDeletedManagementBulkRestoreDialog({
    isOpen,
    selectedCount,
    isLoading,
    onClose,
    onConfirm,
}: PropsType) {
    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="ユーザーを復元" size="small">
            <div className="flex flex-col gap-5">
                <p className="text-sm text-gray-700">
                    {selectedCount}件のユーザーを復元します。
                </p>
                <div className="flex justify-end gap-2">
                    <Button
                        colorType="blue"
                        sizeType="medium"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 h-9 py-0 bg-[#fcfdfd] border border-gray-300 text-sm text-gray-600 hover:bg-gray-200"
                    >
                        キャンセル
                    </Button>
                    <Button
                        colorType="blue"
                        sizeType="medium"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 h-9 py-0 font-medium disabled:opacity-50"
                    >
                        {isLoading ? "復元中..." : "復元する"}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
