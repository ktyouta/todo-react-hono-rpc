import { FieldErrors, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";
import { useCreateTodoMutation } from "../api/create-todo";
import { TodoCreateRequestType } from "../types/todo-create-request-type";
import { useTodoCreateForm } from "./use-todo-create.form";

export function useTodoCreate() {

    // 入力フォーム用
    const { register, handleSubmit, formState: { errors }, reset } = useTodoCreateForm();
    // タスク作成リクエスト
    const postMutation = useCreateTodoMutation({
        onSuccess: (response) => {
            toast.success(response.message);
            reset({
                title: ``,
                content: ``,
            });
        },
        onError: (errMessage) => {
            toast.error(errMessage);
        }
    });

    /**
     * 作成ボタン押下
     */
    const clickCreate = handleSubmit((data) => {
        // 登録リクエスト呼び出し
        postMutation.mutate({
            title: data.title,
            content: data.content,
        });
    });

    return {
        register,
        errors,
        clickCreate,
    };
}

export type UseTodoCreateReturn = {
    register: UseFormRegister<TodoCreateRequestType>;
    errors: FieldErrors<TodoCreateRequestType>;
    clickCreate: () => void;
};
