import { paths } from "@/config/paths";
import { CATEGORY_ID } from "@/constants/master";
import { getCategory } from "@/features/api/get-category";
import { getPriority } from "@/features/api/get-priority";
import { getStatus } from "@/features/api/get-status";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useSwitch } from "@/hooks/use-switch";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDeleteSubtaskMutation } from "../api/delete-subtask";
import { useGetSubtask } from "../api/get-subtask";
import { useUpdateSubtaskMutation } from "../api/update-subtask";
import { useSubtaskId } from "./use-subtask-id";
import { useSubtaskUpdateForm } from "./use-subtask-update.form";
import { useTaskId } from "./use-task-id";

export function useSubtaskDetail() {

    // 親タスクID
    const taskId = useTaskId();
    // サブタスクID
    const subId = useSubtaskId();
    // サブタスク詳細
    const { data } = useGetSubtask({ taskId, subId });
    const task = data.data;
    // ステータスリスト
    const { data: status } = getStatus();
    // カテゴリリスト
    const { data: category } = getCategory();
    // 優先度
    const { data: priority } = getPriority();
    // ルーティング用
    const { appGoBack } = useAppNavigation();
    // 編集モード
    const [isEditMode, setIsEditMode] = useState(false);
    // 削除確認ダイアログ
    const deleteDialog = useSwitch();
    // フォーム
    const { register, control, handleSubmit, formState: { errors }, reset, watch } = useSubtaskUpdateForm({ task });
    // 選択中のカテゴリ
    const selectedCategoryId = watch("category");
    // サブタスク更新ミューテーション
    const updateSubtaskMutation = useUpdateSubtaskMutation({
        taskId,
        subId,
        onSuccess: (response) => {
            toast.success(response.message);
            setIsEditMode(false);
        },
        onError: () => {
            toast.error(`サブタスクの更新に失敗しました。時間をおいて再度お試しください。`);
        },
    });
    // サブタスク削除ミューテーション
    const deleteSubtaskMutation = useDeleteSubtaskMutation({
        taskId,
        subId,
        onSuccess: (message) => {
            toast.success(message);
            appGoBack(paths.todoDetail.getHref(Number(taskId)));
        },
        onError: (message) => {
            toast.error(message ?? `サブタスクの削除に失敗しました。時間をおいて再度お試しください。`);
        },
    });

    /**
     * 親タスク詳細に戻る
     */
    function onClickBack() {
        appGoBack(paths.todoDetail.getHref(Number(taskId)));
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
     * 保存ボタン押下
     */
    const clickSave = handleSubmit((data) => {
        updateSubtaskMutation.mutate({
            title: data.title,
            content: data.content,
            category: data.category,
            status: data.category !== CATEGORY_ID.MEMO ? data.status : undefined,
            priority: data.category !== CATEGORY_ID.MEMO ? data.priority : undefined,
            dueDate: data.category !== CATEGORY_ID.MEMO ? data.dueDate : undefined,
        });
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
        deleteSubtaskMutation.mutate();
    }

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
        isLoading: updateSubtaskMutation.isPending || deleteSubtaskMutation.isPending,
    };
}
