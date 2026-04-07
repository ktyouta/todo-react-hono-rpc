import { useState } from "react";
import { toast } from "react-toastify";
import { useBulkDeleteUserManagementMutation } from "../api/bulk-delete-user-management";
import { UserManagementListReturnType } from "../api/get-user-management-list";

type PropsType = {
    userData: UserManagementListReturnType;
    loginUserId: number | undefined;
};

export function useUserManagementBulk({ userData, loginUserId }: PropsType) {

    // 一括操作モードフラグ
    const [isBulkMode, setIsBulkMode] = useState(false);
    // 選択中のユーザーID
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    // 一括削除ダイアログ開閉
    const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
    // 自分自身を除いた選択可能なユーザーリスト
    const selectableList = userData.list.filter((u) => u.id !== loginUserId);
    // チェックボックス全選択フラグ（自分自身を除く）
    const isAllSelected =
        selectableList.length > 0 &&
        selectableList.every((u) => selectedIds.includes(u.id));
    // 一括削除ミューテーション
    const bulkDeleteMutation = useBulkDeleteUserManagementMutation({
        onSuccess: (data) => {
            toast.success(data.message);
            setIsBulkDeleteDialogOpen(false);
            exitBulkMode();
        },
        onError: (message) => {
            toast.error(message ?? "一括削除に失敗しました。時間をおいて再度お試しください。");
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
     * 全選択 / 全解除（自分自身を除く）
     */
    function onSelectAll(checked: boolean) {
        setSelectedIds(checked ? selectableList.map((u) => u.id) : []);
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
     * 自分自身かどうかを判定（チェックボックス disabled 用）
     */
    function isDisabled(id: number) {
        return id === loginUserId;
    }

    /**
     * 一括削除ダイアログを開く
     */
    function onOpenBulkDeleteDialog() {
        setIsBulkDeleteDialogOpen(true);
    }

    /**
     * 一括削除ダイアログを閉じる
     */
    function onCloseBulkDeleteDialog() {
        setIsBulkDeleteDialogOpen(false);
    }

    /**
     * 一括削除を実行
     */
    function onConfirmBulkDelete() {
        bulkDeleteMutation.mutate({ ids: selectedIds });
    }

    return {
        isBulkMode,
        selectedIds,
        isAllSelected,
        isBulkDeleteDialogOpen,
        onToggleBulkMode,
        onSelectAll,
        onSelectItem,
        isDisabled,
        onOpenBulkDeleteDialog,
        onCloseBulkDeleteDialog,
        onConfirmBulkDelete,
        isBulkDeleteLoading: bulkDeleteMutation.isPending,
        exitBulkMode,
    };
}

export type UseUserManagementBulkReturn = ReturnType<typeof useUserManagementBulk>;
