import { paths } from "@/config/paths";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { TaskListType, useGetTodoList } from "../api/get-todo-list";

export function useTodoList() {

    // タスク一覧
    const { data } = useGetTodoList();
    // ルーティング用
    const { appNavigate } = useAppNavigation();

    /**
     * テーブルの行クリックイベント
     * @param entry 
     */
    function onRowClick(entry: TaskListType[number]) {
        appNavigate(`${paths.todoDetail.getHref(entry.id)}`);
    }

    return {
        taskList: data.data,
        onRowClick,
    };
}