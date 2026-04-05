import { CategoryReturnType } from "@/features/api/get-category";
import { PriorityReturnType } from "@/features/api/get-priority";
import { StatusReturnType } from "@/features/api/get-status";
import { useState } from "react";
import { toast } from "react-toastify";
import { useBulkDeleteTodoMutation } from "../api/bulk-delete-todo";
import { useBulkUpdateTodoMutation } from "../api/bulk-update-todo";
import { TaskListDataType } from "../api/get-todo-list";

export type BulkUpdateFormValues = {
    categoryId?: number;
    statusId?: number;
    priorityId?: number;
};

type PropsType = {
    taskData: TaskListDataType;
    categoryList: CategoryReturnType;
    statusList: StatusReturnType;
    priorityList: PriorityReturnType;
};

export function useTodoBulk({ taskData, categoryList, statusList, priorityList }: PropsType) {

    // 一括操作モードフラグ
    const [isBulkMode, setIsBulkMode] = useState(false);
    // 選択中のタスクID
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    // 一括変更ダイアログ開閉
    const [isBulkUpdateDialogOpen, setIsBulkUpdateDialogOpen] = useState(false);
    // 一括削除ダイアログ開閉
    const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
    // チェックボックス全選択フラグ
    const isAllSelected =
        taskData.list.length > 0 &&
        taskData.list.every((t) => selectedIds.includes(t.id));
    // 一括削除ミューテーション
    const bulkDeleteMutation = useBulkDeleteTodoMutation({
        onSuccess: (data) => {
            toast.success(data.message);
            setIsBulkDeleteDialogOpen(false);
            exitBulkMode();
        },
        onError: (message) => {
            toast.error(message ?? "一括削除に失敗しました。時間をおいて再度お試しください。");
        },
    });
    // 一括更新ミューテーション
    const bulkUpdateMutation = useBulkUpdateTodoMutation({
        onSuccess: (data) => {
            toast.success(data.message);
            setIsBulkUpdateDialogOpen(false);
            exitBulkMode();
        },
        onError: (message) => {
            toast.error(message ?? "一括更新に失敗しました。時間をおいて再度お試しください。");
        },
    });

    /**
     * 一括操作モードを終了し状態をリセット
     */
    function exitBulkMode() {
        setIsBulkMode(false);
        setSelectedIds([]);
    }

    /**
     * 一括操作モード切替
     */
    function onToggleBulkMode() {
        if (isBulkMode) {
            exitBulkMode();
        }
        else {
            setIsBulkMode(true);
            setSelectedIds([]);
        }
    }

    /**
     * 全選択 / 全解除
     */
    function onSelectAll(checked: boolean) {
        setSelectedIds(checked ? taskData.list.map((t) => t.id) : []);
    }

    /**
     * 行の選択切替
     */
    function onSelectItem(id: number, checked: boolean) {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((i) => i !== id)
        );
    }

    /**
     * 一括変更ダイアログを開く
     */
    function onOpenBulkUpdateDialog() {
        setIsBulkUpdateDialogOpen(true);
    }

    /**
     * 一括変更ダイアログを閉じる
     */
    function onCloseBulkUpdateDialog() {
        setIsBulkUpdateDialogOpen(false);
    }

    /**
     * 一括削除ダイアログを開く
     */
    function onOpenBulkDeleteDialog() {
        setIsBulkDeleteDialogOpen(true);
    }

    /**
     * 一括削除ダイアログを閉じる
     */
    function onCloseBulkDeleteDialog() {
        setIsBulkDeleteDialogOpen(false);
    }

    /**
     * 一括変更を実行
     */
    function onConfirmBulkUpdate(values: BulkUpdateFormValues) {
        bulkUpdateMutation.mutate({
            ids: selectedIds,
            ...values,
        });
    }

    /**
     * 一括削除を実行
     */
    function onConfirmBulkDelete() {
        bulkDeleteMutation.mutate({ ids: selectedIds });
    }

    return {
        isBulkMode,
        selectedIds,
        isAllSelected,
        isBulkUpdateDialogOpen,
        isBulkDeleteDialogOpen,
        onToggleBulkMode,
        onSelectAll,
        onSelectItem,
        onOpenBulkUpdateDialog,
        onCloseBulkUpdateDialog,
        onOpenBulkDeleteDialog,
        onCloseBulkDeleteDialog,
        onConfirmBulkUpdate,
        onConfirmBulkDelete,
        isBulkUpdateLoading: bulkUpdateMutation.isPending,
        isBulkDeleteLoading: bulkDeleteMutation.isPending,
        categoryList,
        statusList,
        priorityList,
    };
}

export type UseTodoBulkReturn = ReturnType<typeof useTodoBulk>;
