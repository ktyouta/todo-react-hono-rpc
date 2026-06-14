import { paths } from "@/config/paths";
import { CATEGORY_ID } from "@/constants/master";
import { getCategory } from "@/features/api/get-category";
import { getPriority } from "@/features/api/get-priority";
import { getStatus } from "@/features/api/get-status";
import { TodoAssistResponseType, useTodoAssistMutation } from "@/features/api/todo-assist";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useSwitch } from "@/hooks/use-switch";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeleteTodoMutation } from "../api/delete-todo";
import { TaskResponseType, useGetTodo } from "../api/get-todo";
import { todoKeys } from "../api/query-key";
import { useUpdateTodoMutation } from "../api/update-todo";
import { useUpdateTodoFavoriteMutation } from "../api/update-todo-favorite";
import { useTaskId } from "./use-task-id";
import { useTodoUpdateForm } from "./use-todo-update.form";

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
    // 優先度
    const { data: priority } = getPriority();
    // ルーティング用
    const navigate = useNavigate();
    const { appGoBack } = useAppNavigation();
    // 編集モード
    const [isEditMode, setIsEditMode] = useState(false);
    // 削除確認ダイアログ
    const deleteDialog = useSwitch();
    // タスク更新用
    const { register, control, handleSubmit, formState: { errors }, reset, watch, getValues, setValue } = useTodoUpdateForm({
        task
    });
    // 選択中のカテゴリ
    const selectedCategoryId = watch("category");
    // AIで整えるボタンの活性判定用
    const watchedTitle = watch("title");
    const watchedContent = watch("content");
    // AIで整形ボタン活性フラグ
    const isAssistEnabled = !!(watchedTitle?.trim() || watchedContent?.trim());
    // AI提案の結果
    const [assistResult, setAssistResult] = useState<TodoAssistResponseType | null>(null);

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
    // QueryClientインスタンス
    const queryClient = useQueryClient();
    // お気に入りトグル用ミューテーション
    const updateFavoriteMutation = useUpdateTodoFavoriteMutation({
        // APIコール前の楽観的更新
        onMutate: async ({ id, isFavorite }) => {

            await queryClient.cancelQueries({ queryKey: todoKeys.detail(id) });

            const previousData = queryClient.getQueryData<TaskResponseType>(
                todoKeys.detail(id)
            );

            queryClient.setQueriesData<TaskResponseType>(
                { queryKey: todoKeys.detail(id) },
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        data: { ...old.data, isFavorite },
                    };
                }
            );
            return { previousData };
        },
        onError: (context) => {
            // 失敗時はキャッシュから復元
            if (context?.previousData) {
                queryClient.setQueriesData({ queryKey: todoKeys.detail(taskId) }, context.previousData);
            }
            toast.error('お気に入りの更新に失敗しました。時間をおいて再度お試しください。');
        },
    });
    // タスク削除用ミューテーション
    const deleteTodoMutation = useDeleteTodoMutation({
        id: taskId,
        onSuccess: (message) => {
            toast.success(message);
            appGoBack(task.parentId ? paths.todoDetail.getHref(task.parentId) : paths.todo.path);
        },
        onError: (message) => {
            toast.error(message ?? `タスクの削除に失敗しました。時間をおいて再度お試しください。`);
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

    /**
     * お気に入りトグル
     */
    function onFavoriteToggle() {
        updateFavoriteMutation.mutate({
            id: taskId,
            isFavorite: !task.isFavorite,
        });
    }

    /**
     * 一覧へ戻る
     */
    function onClickBack() {
        navigate(paths.todo.path);
    }

    /**
     * ツリービューへ遷移
     */
    function onClickTree() {
        navigate(paths.todoTree.getHref(task.id));
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
     * 保存ボタン押下
     */
    const clickSave = handleSubmit((data) => {
        updateTodoMutation.mutate({
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
        deleteTodoMutation.mutate();
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
        task,
        onFavoriteToggle,
        statusList: status.data,
        categoryList: category.data,
        priorityList: priority.data,
        isEditMode,
        isDeleteDialogOpen: deleteDialog.flag,
        onClickBack,
        onClickTree,
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
        isLoading: updateTodoMutation.isPending || deleteTodoMutation.isPending,
        assistResult,
        isAssistLoading: assistMutation.isPending,
        isAssistEnabled,
        clickAssist,
        applyAssist,
        cancelAssist,
    };
}
