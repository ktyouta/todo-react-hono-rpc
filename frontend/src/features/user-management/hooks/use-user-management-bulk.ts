import { useState } from "react";
import { toast } from "react-toastify";
import { useBulkDeleteUserManagementMutation } from "../api/bulk-delete-user-management";
import { useBulkUpdateUserManagementRoleMutation } from "../api/bulk-update-user-management-role";
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
    // 一括ロール変更ダイアログ開閉
    const [isBulkRoleDialogOpen, setIsBulkRoleDialogOpen] = useState(false);
    // 一括ロール変更：選択中のロールID
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    // 一括ロール変更：サーバーエラーメッセージ
    const [bulkRoleErrorMessage, setBulkRoleErrorMessage] = useState<string | null>(null);
    // 自分自身を除いた選択可能なユーザーリスト
    const selectableList = userData.list.filter((u) => u.id !== loginUserId);
    // チェックボックス全選択フラグ（自分自身を除く）
    const isAllSelected =
        selectableList.length > 0 &&
        selectableList.every((u) => selectedIds.includes(u.id));
    // 一括ロール変更ミューテーション
    const bulkRoleMutation = useBulkUpdateUserManagementRoleMutation({
        onSuccess: (data) => {
            toast.success(data.message);
            setIsBulkRoleDialogOpen(false);
            setBulkRoleErrorMessage(null);
            exitBulkMode();
        },
        onError: (message) => {
            setBulkRoleErrorMessage(message ?? "一括ロール変更に失敗しました。時間をおいて再度お試しください。");
        },
    });

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
     * 一括ロール変更ダイアログを開く
     */
    function onOpenBulkRoleDialog() {
        setSelectedRoleId(null);
        setBulkRoleErrorMessage(null);
        setIsBulkRoleDialogOpen(true);
    }

    /**
     * 一括ロール変更ダイアログを閉じる
     */
    function onCloseBulkRoleDialog() {
        setIsBulkRoleDialogOpen(false);
        setBulkRoleErrorMessage(null);
    }

    /**
     * ロール選択
     */
    function onSelectRole(roleId: number | null) {
        setSelectedRoleId(roleId);
        setBulkRoleErrorMessage(null);
    }

    /**
     * 一括ロール変更を実行
     */
    function onConfirmBulkRole() {
        if (selectedRoleId === null) return;
        bulkRoleMutation.mutate({ ids: selectedIds, roleId: selectedRoleId });
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
        isBulkRoleDialogOpen,
        selectedRoleId,
        bulkRoleErrorMessage,
        onToggleBulkMode,
        onSelectAll,
        onSelectItem,
        isDisabled,
        onOpenBulkDeleteDialog,
        onCloseBulkDeleteDialog,
        onConfirmBulkDelete,
        onOpenBulkRoleDialog,
        onCloseBulkRoleDialog,
        onSelectRole,
        onConfirmBulkRole,
        isBulkDeleteLoading: bulkDeleteMutation.isPending,
        isBulkRoleLoading: bulkRoleMutation.isPending,
        exitBulkMode,
    };
}

export type UseUserManagementBulkReturn = ReturnType<typeof useUserManagementBulk>;
