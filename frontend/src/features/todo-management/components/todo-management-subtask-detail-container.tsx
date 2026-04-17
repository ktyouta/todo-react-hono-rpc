import { useTodoManagementSubtaskDetail } from "../hooks/use-todo-management-subtask-detail";
import { TodoManagementSubtaskDetailEdit } from "./todo-management-subtask-detail-edit";
import { TodoManagementSubtaskDetailView } from "./todo-management-subtask-detail-view";

export function TodoManagementSubtaskDetailContainer() {

    const props = useTodoManagementSubtaskDetail();

    if (props.isEditMode) {
        return (
            <TodoManagementSubtaskDetailEdit
                {...props}
            />
        );
    }

    return (
        <TodoManagementSubtaskDetailView
            {...props}
        />
    );
}
