import { paths } from "@/config/paths";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useSwitch } from "@/hooks/use-switch";
import { toast } from "react-toastify";
import { useDeleteUserDeletedManagementMutation } from "../api/delete-user-deleted-management";
import { useGetUserDeletedManagement } from "../api/get-user-deleted-management";
import { useRestoreUserDeletedManagementMutation } from "../api/restore-user-deleted-management";
import { useUserDeletedManagementId } from "./use-user-deleted-management-id";

export function useUserDeletedManagementDetail() {

    // ユーザーID
    const userId = useUserDeletedManagementId();
    // ユーザー詳細
    const { data } = useGetUserDeletedManagement({ id: userId });
    const user = data.data;
    // ルーティング用
    const { appGoBack } = useAppNavigation();
    // 復元確認ダイアログ
    const restoreDialog = useSwitch();
    // 物理削除確認ダイアログ
    const deleteDialog = useSwitch();

    // 復元ミューテーション
    const restoreMutation = useRestoreUserDeletedManagementMutation({
        id: userId,
        onSuccess: (message) => {
            toast.success(message);
            appGoBack(paths.userDeletedManagement.path);
        },
        onError: (message) => {
            toast.error(message);
        },
    });

    // 物理削除ミューテーション
    const deleteMutation = useDeleteUserDeletedManagementMutation({
        id: userId,
        onSuccess: (message) => {
            toast.success(message);
            appGoBack(paths.userDeletedManagement.path);
        },
        onError: (message) => {
            toast.error(message);
        },
    });

    /**
     * 一覧に戻る
     */
    function onClickBack() {
        appGoBack(paths.userDeletedManagement.path);
    }

    /**
     * 復元確認ダイアログを開く
     */
    function onClickRestore() {
        restoreDialog.on();
    }

    /**
     * 復元確認ダイアログを閉じる
     */
    function onCancelRestore() {
        restoreDialog.off();
    }

    /**
     * 復元実行
     */
    function onConfirmRestore() {
        restoreDialog.off();
        restoreMutation.mutate();
    }

    /**
     * 物理削除確認ダイアログを開く
     */
    function onClickDelete() {
        deleteDialog.on();
    }

    /**
     * 物理削除確認ダイアログを閉じる
     */
    function onCancelDelete() {
        deleteDialog.off();
    }

    /**
     * 物理削除実行
     */
    function onConfirmDelete() {
        deleteDialog.off();
        deleteMutation.mutate();
    }

    return {
        user,
        onClickBack,
        isRestoreDialogOpen: restoreDialog.flag,
        onClickRestore,
        onCancelRestore,
        onConfirmRestore,
        isDeleteDialogOpen: deleteDialog.flag,
        onClickDelete,
        onCancelDelete,
        onConfirmDelete,
        isLoading: restoreMutation.isPending || deleteMutation.isPending,
    };
}
