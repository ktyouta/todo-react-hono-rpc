import { useTodoManagementSubtaskDetail } from "../hooks/use-todo-management-subtask-detail";
import { TodoManagementSubtaskDetailView } from "./todo-management-subtask-detail-view";

export function TodoManagementSubtaskDetailContainer() {

    const props = useTodoManagementSubtaskDetail();

    return (
        <TodoManagementSubtaskDetailView
            {...props}
        />
    );
}
