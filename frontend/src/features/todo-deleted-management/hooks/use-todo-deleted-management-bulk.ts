import { useState } from "react";
import { toast } from "react-toastify";
import { useBulkRestoreTodoDeletedManagementMutation } from "../api/bulk-restore-todo-deleted-management";
import { TodoDeletedManagementListReturnType } from "../api/get-todo-deleted-management-list";

type PropsType = {
    taskData: TodoDeletedManagementListReturnType;
};

export function useTodoDeletedManagementBulk({ taskData }: PropsType) {

    // 一括操作モードフラグ
    const [isBulkMode, setIsBulkMode] = useState(false);
    // 選択中のタスクID
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    // 一括復元ダイアログ開閉
    const [isBulkRestoreDialogOpen, setIsBulkRestoreDialogOpen] = useState(false);
    // チェックボックス全選択フラグ
    const isAllSelected =
        taskData.list.length > 0 &&
        taskData.list.every((t) => selectedIds.includes(t.id));
    // 一括復元ミューテーション
    const bulkRestoreMutation = useBulkRestoreTodoDeletedManagementMutation({
        onSuccess: (data) => {
            toast.success(data.message);
            setIsBulkRestoreDialogOpen(false);
            exitBulkMode();
        },
        onError: (message) => {
            toast.error(message ?? "一括復元に失敗しました。時間をおいて再度お試しください。");
        },
    });

    /**
     * 一括操作モードを終了し状態をリセット
     */
    function exitBulkMode() {
        setIsBulkMode(false);
        setSelectedIds([]);
    }

    /**
     * 一括操作モード切替
     */
    function onToggleBulkMode() {
        if (isBulkMode) {
            exitBulkMode();
        }
        else {
            setIsBulkMode(true);
            setSelectedIds([]);
        }
    }

    /**
     * 全選択 / 全解除
     */
    function onSelectAll(checked: boolean) {
        setSelectedIds(checked ? taskData.list.map((t) => t.id) : []);
    }

    /**
     * 行の選択切替
     */
    function onSelectItem(id: number, checked: boolean) {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((i) => i !== id)
        );
    }

    /**
     * 一括復元ダイアログを開く
     */
    function onOpenBulkRestoreDialog() {
        setIsBulkRestoreDialogOpen(true);
    }

    /**
     * 一括復元ダイアログを閉じる
     */
    function onCloseBulkRestoreDialog() {
        setIsBulkRestoreDialogOpen(false);
    }

    /**
     * 一括復元を実行
     */
    function onConfirmBulkRestore() {
        bulkRestoreMutation.mutate({ ids: selectedIds });
    }

    return {
        isBulkMode,
        selectedIds,
        isAllSelected,
        isBulkRestoreDialogOpen,
        onToggleBulkMode,
        onSelectAll,
        onSelectItem,
        onOpenBulkRestoreDialog,
        onCloseBulkRestoreDialog,
        onConfirmBulkRestore,
        isBulkRestoreLoading: bulkRestoreMutation.isPending,
        exitBulkMode,
    };
}

export type UseTodoDeletedManagementBulkReturn = ReturnType<typeof useTodoDeletedManagementBulk>;
