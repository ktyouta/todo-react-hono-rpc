import { useState } from "react";
import { useGetTodoTrashSubtaskList } from "../api/get-todo-trash-subtask-list";
import { useTodoTrashId } from "./use-todo-trash-id";

export function useTodoTrashSubtaskSection() {

    // タスクID
    const taskId = useTodoTrashId();
    // ページ
    const [page, setPage] = useState(1);
    // サブタスク
    const { data, isLoading } = useGetTodoTrashSubtaskList({ taskId, page });

    return {
        subtasks: data?.data.list ?? [],
        currentPage: page,
        totalPages: data?.data.totalPages ?? 1,
        onPageChange: setPage,
        isLoading,
    };
}
