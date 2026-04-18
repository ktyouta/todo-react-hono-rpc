import { useState } from "react";
import { useGetTodoDeletedSubtaskList } from "../api/get-todo-deleted-subtask-list";
import { useTodoDeletedManagementId } from "./use-todo-deleted-management-id";

export function useTodoDeletedManagementSubtaskSection() {

    const taskId = useTodoDeletedManagementId();
    const [page, setPage] = useState(1);
    const { data, isLoading } = useGetTodoDeletedSubtaskList({ taskId, page });

    return {
        subtasks: data?.data.list ?? [],
        currentPage: page,
        totalPages: data?.data.totalPages ?? 1,
        onPageChange: setPage,
        isLoading,
    };
}
