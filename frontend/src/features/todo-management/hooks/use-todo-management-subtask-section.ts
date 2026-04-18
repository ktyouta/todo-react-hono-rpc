import { paths } from "@/config/paths";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useState } from "react";
import { useGetTodoManagementSubtaskList } from "../api/get-todo-management-subtask-list";
import { useTaskManagementId } from "./use-task-management-id";

export function useTodoManagementSubtaskSection() {

    // タスクID
    const taskId = useTaskManagementId();
    const [page, setPage] = useState(1);
    // サブタスク一覧
    const { data, isLoading } = useGetTodoManagementSubtaskList({ taskId, page });
    // 画面遷移用
    const { appNavigate } = useAppNavigation();

    /**
     * サブタスク詳細画面に遷移
     */
    function onClickSubtask(subId: number) {
        appNavigate(paths.todoManagementSubtaskDetail.getHref(Number(taskId), subId));
    }

    return {
        subtasks: data?.data.list ?? [],
        currentPage: page,
        totalPages: data?.data.totalPages ?? 1,
        onPageChange: setPage,
        onClickSubtask,
        isLoading,
    };
}
