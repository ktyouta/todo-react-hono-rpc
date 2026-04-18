import { useState } from "react";
import { useGetTodoTrashSubtaskList } from "../api/get-todo-trash-subtask-list";
import { useTodoTrashId } from "./use-todo-trash-id";

export function useTodoTrashSubtaskSection() {

    const taskId = useTodoTrashId();
    const [page, setPage] = useState(1);
    const { data, isLoading } = useGetTodoTrashSubtaskList({ taskId, page });

    return {
        subtasks: data?.data.list ?? [],
        currentPage: page,
        totalPages: data?.data.totalPages ?? 1,
        onPageChange: setPage,
        isLoading,
    };
}
