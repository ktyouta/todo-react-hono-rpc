import { CATEGORY_ID } from "@/constants/master";
import { getCategory } from "@/features/api/get-category";
import { getStatus } from "@/features/api/get-status";
import { toast } from "react-toastify";
import { useCreateTodoMutation } from "../api/create-todo";
import { useTodoCreateForm } from "./use-todo-create.form";

export function useTodoCreate() {

    // 入力フォーム用
    const { register, handleSubmit, formState: { errors }, reset, watch } = useTodoCreateForm();
    // ステータスリスト
    const { data: status } = getStatus();
    // カテゴリリスト
    const { data: category } = getCategory();
    // タスク作成リクエスト
    const postMutation = useCreateTodoMutation({
        onSuccess: (response) => {
            toast.success(response.message);
            reset({
                title: ``,
                content: ``,
                categoryId: 1,
                statusId: 1,
            });
        },
        onError: (errMessage) => {
            toast.error(errMessage);
        }
    });
    // 選択中のカテゴリID
    const selectedCategoryId = watch("categoryId");

    /**
     * 作成ボタン押下
     */
    const clickCreate = handleSubmit((data) => {
        // 登録リクエスト呼び出し
        postMutation.mutate({
            title: data.title,
            content: data.content,
            category: data.categoryId,
            status: data.categoryId !== CATEGORY_ID.MEMO ? data.statusId : undefined,
        });
    });

    return {
        register,
        errors,
        clickCreate,
        statusList: status.data,
        categoryList: category.data,
        selectedCategoryId,
    };
}
