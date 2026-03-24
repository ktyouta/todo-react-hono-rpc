import { LoginUserContext } from "@/app/components/login-user-provider";
import { paths } from "@/config/paths";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useSwitch } from "@/hooks/use-switch";
import { toast } from "react-toastify";
import { useDeleteTodoDeletedManagementMutation } from "../api/delete-todo-deleted-management";
import { useGetTodoDeletedManagement } from "../api/get-todo-deleted-management";
import { useRestoreTodoDeletedManagementMutation } from "../api/restore-todo-deleted-management";
import { useTodoDeletedManagementId } from "./use-todo-deleted-management-id";

export function useTodoDeletedManagementDetail() {

    // タスクID
    const taskId = useTodoDeletedManagementId();
    // タスク詳細
    const { data } = useGetTodoDeletedManagement({ id: taskId });
    const task = data.data;
    // ルーティング用
    const { appGoBack } = useAppNavigation();
    // 復元確認ダイアログ
    const restoreDialog = useSwitch();
    // 物理削除確認ダイアログ
    const deleteDialog = useSwitch();
    // ログインユーザー情報
    const loginUser = LoginUserContext.useCtx();

    // 復元ミューテーション
    const restoreMutation = useRestoreTodoDeletedManagementMutation({
        id: taskId,
        onSuccess: (message) => {
            toast.success(message);
            appGoBack(paths.todoDeletedManagement.path);
        },
        onError: (message) => {
            toast.error(message);
        },
    });

    // 物理削除ミューテーション
    const deleteMutation = useDeleteTodoDeletedManagementMutation({
        id: taskId,
        onSuccess: (message) => {
            toast.success(message);
            appGoBack(paths.todoDeletedManagement.path);
        },
        onError: (message) => {
            toast.error(message);
        },
    });

    /**
     * 一覧に戻る
     */
    function onClickBack() {
        appGoBack(paths.todoDeletedManagement.path);
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
        task,
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
        loginUser
    };
}
