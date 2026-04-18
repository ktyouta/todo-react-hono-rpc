import { paths } from "@/config/paths";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useState } from "react";
import { useGetSubtaskList } from "../api/get-subtask-list";
import { useTaskId } from "./use-task-id";

export function useSubtaskSection() {

    // タスクID
    const taskId = useTaskId();
    const [page, setPage] = useState(1);
    // サブタスク
    const { data, isLoading } = useGetSubtaskList({ taskId, page });
    // 画面遷移用
    const { appNavigate } = useAppNavigation();

    /**
     * サブタスク追加画面に遷移
     */
    function onClickAdd() {
        appNavigate(paths.subtaskCreate.getHref(Number(taskId)));
    }

    /**
     * サブタスク詳細画面に遷移
     */
    function onClickSubtask(subId: number) {
        appNavigate(paths.subtaskDetail.getHref(Number(taskId), subId));
    }

    return {
        subtasks: data?.data.list ?? [],
        currentPage: page,
        totalPages: data?.data.totalPages ?? 1,
        onPageChange: setPage,
        onClickAdd,
        onClickSubtask,
        isLoading,
    };
}
