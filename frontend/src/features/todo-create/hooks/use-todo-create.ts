import { paths } from "@/config/paths";
import { CATEGORY_ID } from "@/constants/master";
import { getCategory } from "@/features/api/get-category";
import { getPriority } from "@/features/api/get-priority";
import { getStatus } from "@/features/api/get-status";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCreateTodoMutation } from "../api/create-todo";
import { TodoAssistResponseType, useTodoAssistMutation } from "../api/todo-assist";
import { TODO_CREATE_FORM_DEFAULT_VALUES, useTodoCreateForm } from "./use-todo-create.form";

export function useTodoCreate() {

    // 入力フォーム用
    const { register, control, handleSubmit, formState: { errors }, reset, watch, setValue, getValues } = useTodoCreateForm();
    // ステータスリスト
    const { data: status } = getStatus();
    // カテゴリリスト
    const { data: category } = getCategory();
    // 優先度
    const { data: priority } = getPriority();
    // 作成完了状態
    const [isCompleted, setIsCompleted] = useState(false);
    // タスク作成後のタイトル
    const [createdTitle, setCreatedTitle] = useState("");
    // AI提案の結果
    const [assistResult, setAssistResult] = useState<TodoAssistResponseType | null>(null);
    // タスク作成リクエスト
    const postMutation = useCreateTodoMutation({
        onSuccess: (response) => {
            setCreatedTitle(response.data.title);
            setIsCompleted(true);
        },
        onError: (errMessage) => {
            setAssistResult(null);
            toast.error(errMessage);
        }
    });
    // AIアシストリクエスト
    const assistMutation = useTodoAssistMutation({
        onSuccess: (response) => {
            setAssistResult(response);
        },
        onError: (errMessage) => {
            setAssistResult(null);
            toast.error(errMessage);
        }
    });
    // 選択中のカテゴリID
    const selectedCategoryId = watch("category");
    // AIで整えるボタンの活性判定用
    const watchedTitle = watch("title");
    const watchedContent = watch("content");
    // ルーティング用
    const { appNavigate } = useAppNavigation();
    // AIで整形ボタン活性フラグ
    const isAssistEnabled = !!(watchedTitle?.trim() || watchedContent?.trim());

    /**
     * クリアボタン押下
     */
    function clickClear() {
        reset(TODO_CREATE_FORM_DEFAULT_VALUES);
        setAssistResult(null);
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
        reset(TODO_CREATE_FORM_DEFAULT_VALUES);
    }

    /**
     * 一覧へボタン押下
     */
    function clickGoToList() {
        appNavigate(paths.todo.path);
    }

    /**
     * AIで整えるボタン押下
     */
    function clickAssist() {
        const { title, content } = getValues();

        if (!isAssistEnabled) {
            return;
        }

        assistMutation.mutate({
            title: title,
            content: content,
        });
    }

    /**
     * AI提案をフォームに適用
     */
    function applyAssist() {
        if (!assistResult || !assistResult.canApply) {
            return;
        }
        setValue("title", assistResult.data.title);
        setValue("content", assistResult.data.content);
    }

    /**
     * AI提案をキャンセル
     */
    function cancelAssist() {
        setAssistResult(null);
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
        assistResult,
        isAssistLoading: assistMutation.isPending,
        isAssistEnabled,
        clickAssist,
        applyAssist,
        cancelAssist,
    };
}
