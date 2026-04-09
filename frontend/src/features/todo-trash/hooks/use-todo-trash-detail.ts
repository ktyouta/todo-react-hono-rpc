import { paths } from "@/config/paths";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useSwitch } from "@/hooks/use-switch";
import { toast } from "react-toastify";
import { useDeleteTodoTrashMutation } from "../api/delete-todo-trash";
import { useGetTodoTrash } from "../api/get-todo-trash";
import { useRestoreTodoTrashMutation } from "../api/restore-todo-trash";
import { useTodoTrashId } from "./use-todo-trash-id";

export function useTodoTrashDetail() {

    // タスクID
    const taskId = useTodoTrashId();
    // タスク詳細
    const { data } = useGetTodoTrash({ id: taskId });
    const task = data.data;
    // ルーティング用
    const { appGoBack } = useAppNavigation();
    // 復元確認ダイアログ
    const restoreDialog = useSwitch();
    // 完全削除確認ダイアログ
    const deleteDialog = useSwitch();

    // 復元ミューテーション
    const restoreMutation = useRestoreTodoTrashMutation({
        id: taskId,
        onSuccess: (message) => {
            toast.success(message);
            appGoBack(paths.todoTrash.path);
        },
        onError: (message) => {
            toast.error(message);
        },
    });

    // 完全削除ミューテーション
    const deleteMutation = useDeleteTodoTrashMutation({
        id: taskId,
        onSuccess: (message) => {
            toast.success(message);
            appGoBack(paths.todoTrash.path);
        },
        onError: (message) => {
            toast.error(message);
        },
    });

    /**
     * 一覧に戻る
     */
    function onClickBack() {
        appGoBack(paths.todoTrash.path);
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
     * 完全削除確認ダイアログを開く
     */
    function onClickDelete() {
        deleteDialog.on();
    }

    /**
     * 完全削除確認ダイアログを閉じる
     */
    function onCancelDelete() {
        deleteDialog.off();
    }

    /**
     * 完全削除実行
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
    };
}
