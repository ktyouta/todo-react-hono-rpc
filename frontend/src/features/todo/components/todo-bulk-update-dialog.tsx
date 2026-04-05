import { Button, Select } from "@/components";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { Dialog } from "@/components/ui/dialog/dialog";
import { CategoryReturnType } from "@/features/api/get-category";
import { PriorityReturnType } from "@/features/api/get-priority";
import { StatusReturnType } from "@/features/api/get-status";

type PropsType = {
    isOpen: boolean;
    selectedCount: number;
    isLoading: boolean;
    categoryList: CategoryReturnType;
    statusList: StatusReturnType;
    priorityList: PriorityReturnType;
    categoryEnabled: boolean;
    onCategoryEnabledChange: (checked: boolean) => void;
    statusEnabled: boolean;
    onStatusEnabledChange: (checked: boolean) => void;
    priorityEnabled: boolean;
    onPriorityEnabledChange: (checked: boolean) => void;
    categoryId: number;
    onCategoryIdChange: (id: number) => void;
    statusId: number;
    onStatusIdChange: (id: number) => void;
    priorityId: number;
    onPriorityIdChange: (id: number) => void;
    isMemoSelected: boolean;
    hasSelection: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const SELECT_CLASS = "flex-1 px-3 py-2 text-sm bg-white border-[#c0c0c0]";

export function TodoBulkUpdateDialog({
    isOpen,
    selectedCount,
    isLoading,
    categoryList,
    statusList,
    priorityList,
    categoryEnabled,
    onCategoryEnabledChange,
    statusEnabled,
    onStatusEnabledChange,
    priorityEnabled,
    onPriorityEnabledChange,
    categoryId,
    onCategoryIdChange,
    statusId,
    onStatusIdChange,
    priorityId,
    onPriorityIdChange,
    isMemoSelected,
    hasSelection,
    onClose,
    onConfirm,
}: PropsType) {

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="選択中のタスクを一括変更" size="medium">
            <div className="flex flex-col gap-5">
                <p className="text-sm text-gray-600">{selectedCount}件のタスクを変更します。</p>

                <div className="flex flex-col gap-3">
                    {/* カテゴリ */}
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={categoryEnabled}
                            onChange={onCategoryEnabledChange}
                            size="medium"
                        />
                        <span className="text-sm text-gray-700 w-[4.5em] shrink-0">カテゴリ</span>
                        <Select
                            value={String(categoryId)}
                            onChange={(e) => onCategoryIdChange(Number(e.target.value))}
                            options={categoryList.map((c) => ({ value: String(c.id), label: c.name }))}
                            disabled={!categoryEnabled}
                            className={SELECT_CLASS}
                        />
                    </div>

                    {/* ステータス */}
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={statusEnabled}
                            onChange={onStatusEnabledChange}
                            disabled={isMemoSelected}
                            size="medium"
                        />
                        <span className="text-sm text-gray-700 w-[4.5em] shrink-0">ステータス</span>
                        <Select
                            value={String(statusId)}
                            onChange={(e) => onStatusIdChange(Number(e.target.value))}
                            options={statusList.map((s) => ({ value: String(s.id), label: s.name }))}
                            disabled={!statusEnabled || isMemoSelected}
                            className={SELECT_CLASS}
                        />
                    </div>

                    {/* 優先度 */}
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={priorityEnabled}
                            onChange={onPriorityEnabledChange}
                            disabled={isMemoSelected}
                            size="medium"
                        />
                        <span className="text-sm text-gray-700 w-[4.5em] shrink-0">優先度</span>
                        <Select
                            value={String(priorityId)}
                            onChange={(e) => onPriorityIdChange(Number(e.target.value))}
                            options={priorityList.map((p) => ({ value: String(p.id), label: p.name }))}
                            disabled={!priorityEnabled || isMemoSelected}
                            className={SELECT_CLASS}
                        />
                    </div>
                </div>

                <p className="text-xs text-gray-400">※チェックした項目のみ変更されます</p>

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
                        disabled={!hasSelection || isLoading}
                        className="px-4 h-9 py-0 font-medium disabled:opacity-50"
                    >
                        {isLoading ? "変更中..." : "変更する"}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
