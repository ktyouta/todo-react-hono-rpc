import { paths } from "@/config/paths";
import { CATEGORY_ID } from "@/constants/master";
import { getCategory } from "@/features/api/get-category";
import { getPriority } from "@/features/api/get-priority";
import { getStatus } from "@/features/api/get-status";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCreateTodoMutation } from "../api/create-todo";
import { useTodoCreateForm } from "./use-todo-create.form";

export function useTodoCreate() {

    // 入力フォーム用
    const { register, control, handleSubmit, formState: { errors }, reset, watch } = useTodoCreateForm();
    // ステータスリスト
    const { data: status } = getStatus();
    // カテゴリリスト
    const { data: category } = getCategory();
    // 優先度
    const { data: priority } = getPriority();
    // 作成完了状態
    const [isCompleted, setIsCompleted] = useState(false);
    const [createdTitle, setCreatedTitle] = useState("");
    // タスク作成リクエスト
    const postMutation = useCreateTodoMutation({
        onSuccess: (response) => {
            setCreatedTitle(response.data.title);
            setIsCompleted(true);
        },
        onError: (errMessage) => {
            toast.error(errMessage);
        }
    });
    // 選択中のカテゴリID
    const selectedCategoryId = watch("category");
    // ルーティング用
    const { appNavigate } = useAppNavigation();

    /**
     * クリアボタン押下
     */
    function clickClear() {
        reset({
            title: ``,
            content: ``,
            category: 1,
            status: 1,
            priority: 1,
            dueDate: null,
        });
    };

    /**
     * 作成ボタン押下
     */
    const clickCreate = handleSubmit((data) => {
        // 登録リクエスト呼び出し
        postMutation.mutate({
            title: data.title,
            content: data.content,
            category: data.category,
            status: data.category !== CATEGORY_ID.MEMO ? data.status : undefined,
            priority: data.category !== CATEGORY_ID.MEMO ? data.priority : undefined,
            dueDate: data.category !== CATEGORY_ID.MEMO ? data.dueDate : undefined,
        });
    });

    /**
     * 続けて作成ボタン押下
     */
    function clickContinue() {
        setIsCompleted(false);
        setCreatedTitle("");
        reset({
            title: ``,
            content: ``,
            category: 1,
            status: 1,
            priority: 1,
            dueDate: null,
        });
    }

    /**
     * 一覧へボタン押下
     */
    function clickGoToList() {
        appNavigate(paths.todo.path);
    }

    return {
        register,
        control,
        errors,
        clickCreate,
        clickClear,
        clickContinue,
        statusList: status.data,
        categoryList: category.data,
        priorityList: priority.data,
        selectedCategoryId,
        isLoading: postMutation.isPending,
        isCompleted,
        createdTitle,
        clickGoToList,
    };
}
