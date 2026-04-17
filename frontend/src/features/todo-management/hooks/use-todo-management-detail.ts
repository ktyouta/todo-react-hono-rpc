import { LoginUserContext } from "@/app/components/login-user-provider";
import { paths } from "@/config/paths";
import { CATEGORY_ID } from "@/constants/master";
import { getCategory } from "@/features/api/get-category";
import { getPriority } from "@/features/api/get-priority";
import { getStatus } from "@/features/api/get-status";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useSwitch } from "@/hooks/use-switch";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDeleteTodoManagementMutation } from "../api/delete-todo-management";
import { useGetTodoManagement } from "../api/get-todo-management";
import { useUpdateTodoManagementMutation } from "../api/update-todo-management";
import { TodoManagementDetailEditType } from "../types/todo-management-detail-edit-type";
import { useTaskManagementId } from "./use-task-management-id";
import { useTodoManagementUpdateForm } from "./use-todo-management-update.form";

export function useTodoManagementDetail() {

    // タスクID
    const taskId = useTaskManagementId();
    // タスク詳細
    const { data } = useGetTodoManagement({ id: taskId });
    const task = data.data;
    // ステータスリスト
    const { data: status } = getStatus();
    // カテゴリリスト
    const { data: category } = getCategory();
    // 優先度
    const { data: priority } = getPriority();
    // ルーティング用
    const { appNavigate } = useAppNavigation();
    // 編集モード
    const [isEditMode, setIsEditMode] = useState(false);
    // 削除確認ダイアログ
    const deleteDialog = useSwitch();
    // タスク更新フォーム
    const { register, control, handleSubmit, formState: { errors }, reset, watch } = useTodoManagementUpdateForm({ task });
    // 選択中のカテゴリ
    const selectedCategoryId = watch("category");
    // ログインユーザー情報
    const loginUser = LoginUserContext.useCtx();
    // 保存確認ダイアログ
    const saveDialog = useSwitch();

    // タスク更新用ミューテーション
    const updateMutation = useUpdateTodoManagementMutation({
        id: taskId,
        onSuccess: (response) => {
            toast.success(response.message);
            setIsEditMode(false);
        },
        onError: () => {
            toast.error(`タスクの更新に失敗しました。時間をおいて再度お試しください。`);
        },
    });

    // タスク削除用ミューテーション
    const deleteMutation = useDeleteTodoManagementMutation({
        id: taskId,
        onSuccess: (message) => {
            toast.success(message);
            appNavigate(paths.todoManagement.path);
        },
        onError: () => {
            toast.error(`タスクの削除に失敗しました。時間をおいて再度お試しください。`);
        },
    });

    /**
     * 一覧に戻る
     */
    function onClickBack() {
        appNavigate(paths.todoManagement.path);
    }

    /**
     * 編集ボタン押下
     */
    function onClickEdit() {
        reset({
            title: task.title,
            content: task.content ?? "",
            category: task.categoryId,
            status: task.statusId ?? undefined,
            priority: task.priorityId ?? undefined,
            dueDate: task.dueDate ?? null,
        });
        setIsEditMode(true);
    }

    /**
     * キャンセルボタン押下
     */
    function onClickCancel() {
        setIsEditMode(false);
    }

    /**
     * 更新ミューテーション実行
     * @param data 
     */
    function executeSave(data: TodoManagementDetailEditType) {
        updateMutation.mutate({
            title: data.title,
            content: data.content,
            category: data.category,
            status: data.category !== CATEGORY_ID.MEMO ? data.status : undefined,
            priority: data.category !== CATEGORY_ID.MEMO ? data.priority : undefined,
            dueDate: data.category !== CATEGORY_ID.MEMO ? data.dueDate : undefined,
        });
    }

    /**
     * 保存ボタン押下
     */
    const clickSave = handleSubmit((data) => {

        // 保存前ユーザー確認
        if (task.userId !== loginUser?.id) {
            saveDialog.on();
            return;
        }

        executeSave(data);
    });

    /**
     * 削除確認ダイアログを開く
     */
    function onClickDelete() {
        deleteDialog.on();
    }

    /**
     * 削除確認ダイアログを閉じる
     */
    function onCancelDelete() {
        deleteDialog.off();
    }

    /**
     * 削除実行
     */
    function onConfirmDelete() {
        deleteDialog.off();
        deleteMutation.mutate();
    }

    /**
     * 保存確認ダイアログを閉じる
     */
    function onCancelSave() {
        saveDialog.off();
    }

    /**
     * 保存実行
     */
    const onConfirmSave = handleSubmit((data) => {
        executeSave(data);
        saveDialog.off();
    });

    return {
        task,
        statusList: status.data,
        categoryList: category.data,
        priorityList: priority.data,
        isEditMode,
        isDeleteDialogOpen: deleteDialog.flag,
        onClickBack,
        onClickEdit,
        onClickCancel,
        clickSave,
        onClickDelete,
        onCancelDelete,
        onConfirmDelete,
        register,
        control,
        errors,
        selectedCategoryId,
        isLoading: updateMutation.isPending || deleteMutation.isPending,
        isSaveDialogOpen: saveDialog.flag,
        onCancelSave,
        onConfirmSave,
    };
}
