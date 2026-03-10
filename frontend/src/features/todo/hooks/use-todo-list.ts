import { paths } from "@/config/paths";
import { getCategory } from "@/features/api/get-category";
import { getPriority } from "@/features/api/get-priority";
import { getStatus } from "@/features/api/get-status";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { TaskListReturnType, useGetTodoList } from "../api/get-todo-list";

export function useTodoList() {

    // タスク一覧
    const { data } = useGetTodoList();
    // カテゴリリスト
    const { data: category } = getCategory();
    // ステータスリスト
    const { data: status } = getStatus();
    // 優先度リスト
    const { data: priority } = getPriority();
    // ルーティング用
    const { appNavigate } = useAppNavigation();

    /**
     * テーブルの行クリックイベント
     * @param entry
     */
    function onRowClick(entry: TaskListReturnType[number]) {
        appNavigate(`${paths.todoDetail.getHref(entry.id)}`);
    }

    return {
        taskList: data.data,
        onRowClick,
        categoryList: category.data,
        statusList: status.data,
        priorityList: priority.data,
    };
}
