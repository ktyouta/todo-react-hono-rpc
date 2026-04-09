import { useState } from "react";
import { toast } from "react-toastify";
import { useBulkRestoreUserDeletedManagementMutation } from "../api/bulk-restore-user-deleted-management";
import { UserDeletedManagementListReturnType } from "../api/get-user-deleted-management-list";

type PropsType = {
    userData: UserDeletedManagementListReturnType;
};

export function useUserDeletedManagementBulk({ userData }: PropsType) {

    // 一括操作モードフラグ
    const [isBulkMode, setIsBulkMode] = useState(false);
    // 選択中のユーザーID
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    // 一括復元ダイアログ開閉
    const [isBulkRestoreDialogOpen, setIsBulkRestoreDialogOpen] = useState(false);
    // チェックボックス全選択フラグ
    const isAllSelected =
        userData.list.length > 0 &&
        userData.list.every((u) => selectedIds.includes(u.id));
    // 一括復元ミューテーション
    const bulkRestoreMutation = useBulkRestoreUserDeletedManagementMutation({
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
        setSelectedIds(checked ? userData.list.map((u) => u.id) : []);
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

export type UseUserDeletedManagementBulkReturn = ReturnType<typeof useUserDeletedManagementBulk>;
