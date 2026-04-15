import { paths } from "@/config/paths";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useGetSubtaskList } from "../api/get-subtask-list";
import { useTaskId } from "./use-task-id";

export function useSubtaskSection() {

    // タスクID
    const taskId = useTaskId();
    // サブタスク
    const { data, isLoading } = useGetSubtaskList({ taskId });
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
        subtasks: data?.data ?? [],
        onClickAdd,
        onClickSubtask,
        isLoading,
    };
}
