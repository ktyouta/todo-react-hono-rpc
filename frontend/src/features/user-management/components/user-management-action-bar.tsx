import { Button } from "@/components";
import { Checkbox } from "@/components/ui/checkbox/checkbox";

type PropsType = {
    selectedCount: number;
    isAllSelected: boolean;
    onSelectAll: (checked: boolean) => void;
    onOpenBulkRoleDialog: () => void;
    onOpenBulkDeleteDialog: () => void;
    onCancel: () => void;
};

export function UserManagementActionBar({
    selectedCount,
    isAllSelected,
    onSelectAll,
    onOpenBulkRoleDialog,
    onOpenBulkDeleteDialog,
    onCancel,
}: PropsType) {
    const hasSelection = selectedCount > 0;

    return (
        <div className="pb-4 border-b border-gray-300 mb-3 sm:mb-6">
            <div className="flex flex-wrap items-center gap-3">
                <Checkbox
                    checked={isAllSelected}
                    onChange={onSelectAll}
                    size="medium"
                />
                <span className="text-sm text-gray-600 min-w-[5em]">
                    {selectedCount}件選択中
                </span>
                <div className="flex flex-wrap items-center gap-2 ml-auto">
                    <Button
                        colorType="blue"
                        sizeType="medium"
                        onClick={onOpenBulkRoleDialog}
                        disabled={!hasSelection}
                        className="h-9 py-0 px-3 font-medium whitespace-nowrap disabled:opacity-50"
                    >
                        ロール変更
                    </Button>
                    <Button
                        colorType="blue"
                        sizeType="medium"
                        onClick={onOpenBulkDeleteDialog}
                        disabled={!hasSelection}
                        className="h-9 py-0 px-3 font-medium whitespace-nowrap bg-red-500 hover:bg-red-600 disabled:opacity-50"
                    >
                        削除
                    </Button>
                    <Button
                        colorType="blue"
                        sizeType="medium"
                        onClick={onCancel}
                        className="h-9 py-0 px-3 bg-[#fcfdfd] border border-gray-300 text-sm text-gray-600 hover:bg-gray-200 whitespace-nowrap"
                    >
                        キャンセル
                    </Button>
                </div>
            </div>
        </div>
    );
}
