import { paths } from "@/config/paths";
import { CATEGORY_ID } from "@/constants/master";
import { getCategory } from "@/features/api/get-category";
import { getPriority } from "@/features/api/get-priority";
import { getStatus } from "@/features/api/get-status";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { toast } from "react-toastify";
import { useCreateSubtaskMutation } from "../api/create-subtask";
import { SUBTASK_CREATE_FORM_DEFAULT_VALUES, useSubtaskCreateForm } from "./use-subtask-create.form";
import { useTaskId } from "./use-task-id";

export function useSubtaskCreate() {

    // 親タスクID
    const taskId = useTaskId();
    // フォーム
    const { register, control, handleSubmit, formState: { errors }, watch, reset } = useSubtaskCreateForm();
    // ステータスリスト
    const { data: status } = getStatus();
    // カテゴリリスト
    const { data: category } = getCategory();
    // 優先度
    const { data: priority } = getPriority();
    // 選択中のカテゴリID
    const selectedCategoryId = watch("category");
    // ルーティング用
    const { appGoBack } = useAppNavigation();
    // サブタスク作成ミューテーション
    const createSubtaskMutation = useCreateSubtaskMutation({
        taskId,
        onSuccess: () => {
            toast.success(`サブタスクを追加しました。`);
            appGoBack(paths.todoDetail.getHref(Number(taskId)));
        },
        onError: (message) => {
            toast.error(message);
        },
    });

    /**
     * クリアボタン押下
     */
    function clickClear() {
        reset(SUBTASK_CREATE_FORM_DEFAULT_VALUES);
    }

    /**
     * 親タスク詳細に戻る
     */
    function onClickBack() {
        appGoBack(paths.todoDetail.getHref(Number(taskId)));
    }

    /**
     * 作成ボタン押下
     */
    const clickCreate = handleSubmit((data) => {
        createSubtaskMutation.mutate({
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
        onClickBack,
        statusList: status.data,
        categoryList: category.data,
        priorityList: priority.data,
        selectedCategoryId,
        isLoading: createSubtaskMutation.isPending,
    };
}
