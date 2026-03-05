import { paths } from "@/config/paths";
import { CATEGORY_ID } from "@/constants/master";
import { getCategory } from "@/features/api/get-category";
import { getStatus } from "@/features/api/get-status";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useSwitch } from "@/hooks/use-switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDeleteTodoMutation } from "../api/delete-todo";
import { useGetTodo } from "../api/get-todo";
import { useUpdateTodoMutation } from "../api/update-todo";
import { TodoDetailEditSchema, TodoDetailEditType } from "../types/todo-detail-edit-type";
import { useTaskId } from "./use-task-id";

export function useTodoDetail() {

    // タスクID
    const taskId = useTaskId();
    // タスク詳細
    const { data } = useGetTodo({ id: taskId });
    const task = data.data;
    // ステータスリスト
    const { data: status } = getStatus();
    // カテゴリリスト
    const { data: category } = getCategory();
    // ルーティング用
    const { appGoBack } = useAppNavigation();
    // 編集モード
    const [isEditMode, setIsEditMode] = useState(false);
    // 削除確認ダイアログ
    const deleteDialog = useSwitch();
    // タスク更新用
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<TodoDetailEditType>({
        resolver: zodResolver(TodoDetailEditSchema),
        defaultValues: {
            title: task.title,
            content: task.content ?? "",
            categoryId: task.categoryId,
            statusId: task.statusId ?? undefined,
        },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });
    // 選択中のカテゴリ
    const selectedCategoryId = watch("categoryId");
    // タスク更新用ミューテーション
    const updateTodoMutation = useUpdateTodoMutation({
        id: taskId,
        onSuccess: (response) => {
            const message = response.message;
            toast.success(message);
            setIsEditMode(false);
        },
        onError: () => {
            toast.error(`タスクの更新に失敗しました。時間をおいて再度お試しください。`);
        },
    });
    // タスク削除用ミューテーション
    const deleteTodoMutation = useDeleteTodoMutation({
        id: taskId,
        onSuccess: (message) => {
            toast.success(message);
            appGoBack(paths.todo.path);
        },
        onError: () => {
            toast.error(`タスクの削除に失敗しました。時間をおいて再度お試しください。`);
        }
    });

    /**
     * 一覧に戻る
     */
    function onClickBack() {
        appGoBack(paths.todo.path);
    }

    /**
     * 編集ボタン押下
     */
    function onClickEdit() {
        reset({
            title: task.title,
            content: task.content ?? "",
            categoryId: task.categoryId,
            statusId: task.statusId ?? undefined,
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
        updateTodoMutation.mutate({
            title: data.title,
            content: data.content,
            category: data.categoryId,
            status: data.categoryId !== CATEGORY_ID.MEMO ? data.statusId : undefined,
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
        deleteTodoMutation.mutate();
    }

    return {
        task,
        statusList: status.data,
        categoryList: category.data,
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
        errors,
        selectedCategoryId,
        isLoading: updateTodoMutation.isPending || deleteTodoMutation.isPending,
    };
}
