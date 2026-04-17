import { paths } from "@/config/paths";
import { useSubtaskId } from "@/features/todo/hooks/use-subtask-id";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useGetTodoManagementSubtask } from "../api/get-todo-management-subtask";
import { useTaskManagementId } from "./use-task-management-id";

export function useTodoManagementSubtaskDetail() {

    // タスクID
    const taskId = useTaskManagementId();
    // サブタスクID
    const subId = useSubtaskId();
    // サブタスク
    const { data } = useGetTodoManagementSubtask({ taskId, subId });
    // 画面遷移用
    const { appNavigate } = useAppNavigation();

    /**
     * 親タスク詳細画面に戻る
     */
    function onClickBack() {
        appNavigate(paths.todoManagementDetail.getHref(Number(taskId)));
    }

    return {
        task: data.data,
        onClickBack,
    };
}
