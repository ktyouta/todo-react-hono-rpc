import { paths } from "@/config/paths";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useGetTodoManagementSubtaskList } from "../api/get-todo-management-subtask-list";
import { useTaskManagementId } from "./use-task-management-id";

export function useTodoManagementSubtaskSection() {

    // タスクID
    const taskId = useTaskManagementId();
    // サブタスク一覧
    const { data, isLoading } = useGetTodoManagementSubtaskList({ taskId });
    // 画面遷移用
    const { appNavigate } = useAppNavigation();

    /**
     * サブタスク詳細画面に遷移
     */
    function onClickSubtask(subId: number) {
        appNavigate(paths.todoManagementSubtaskDetail.getHref(Number(taskId), subId));
    }

    return {
        subtasks: data?.data ?? [],
        onClickSubtask,
        isLoading,
    };
}
