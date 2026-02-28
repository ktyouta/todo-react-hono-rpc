import { useGetTodoList } from "../api/get-todo-list";

export function useTodoList() {

    // タスク一覧
    const { data } = useGetTodoList();

    return {
        taskList: data.data,
    };
}