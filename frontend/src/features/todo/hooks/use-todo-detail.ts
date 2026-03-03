import { getCategory } from "@/features/api/get-category";
import { getStatus } from "@/features/api/get-status";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGetTodo } from "../api/get-todo";
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
    // 編集モード
    const [isEditMode, setIsEditMode] = useState(false);
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
    const clickSave = handleSubmit((_data) => {
        // TODO: 更新API呼び出し
        setIsEditMode(false);
    });

    return {
        task,
        statusList: status.data,
        categoryList: category.data,
        isEditMode,
        onClickEdit,
        onClickCancel,
        clickSave,
        register,
        errors,
        selectedCategoryId,
    };
}
