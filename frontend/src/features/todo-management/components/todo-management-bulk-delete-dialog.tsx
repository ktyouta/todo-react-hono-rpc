import { Button } from "@/components";
import { Dialog } from "@/components/ui/dialog/dialog";

type PropsType = {
    isOpen: boolean;
    selectedCount: number;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export function TodoManagementBulkDeleteDialog({
    isOpen,
    selectedCount,
    isLoading,
    onClose,
    onConfirm,
}: PropsType) {
    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="タスクを削除" size="small">
            <div className="flex flex-col gap-5">
                <p className="text-sm text-gray-700">
                    {selectedCount}件のタスクを削除します。
                    <br />
                    削除済み管理から復元できます。
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
                        className="px-4 h-9 py-0 bg-red-500 hover:bg-red-600 font-medium disabled:opacity-50"
                    >
                        {isLoading ? "削除中..." : "削除する"}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
