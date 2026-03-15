import { CATEGORY_ID } from "@/constants/master";
import { getCategory } from "@/features/api/get-category";
import { getPriority } from "@/features/api/get-priority";
import { getStatus } from "@/features/api/get-status";
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
    // タスク作成リクエスト
    const postMutation = useCreateTodoMutation({
        onSuccess: (response) => {
            toast.success(response.message);
            reset({
                title: ``,
                content: ``,
                category: 1,
                status: 1,
                priority: 1,
                dueDate: null,
            });
        },
        onError: (errMessage) => {
            toast.error(errMessage);
        }
    });
    // 選択中のカテゴリID
    const selectedCategoryId = watch("category");

    /**
     * クリアボタン押下
     */
    const clickClear = () => {
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

    return {
        register,
        control,
        errors,
        clickCreate,
        clickClear,
        statusList: status.data,
        categoryList: category.data,
        priorityList: priority.data,
        selectedCategoryId,
    };
}
