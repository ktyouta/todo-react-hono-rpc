import { useTodoManagementDetail } from "../hooks/use-todo-management-detail";
import { TodoManagementDetailEdit } from "./todo-management-detail-edit";
import { TodoManagementDetailView } from "./todo-management-detail-view";

export function TodoManagementDetailContainer() {
    const props = useTodoManagementDetail();

    if (props.isEditMode) {
        return <TodoManagementDetailEdit {...props} />;
    }

    return <TodoManagementDetailView {...props} />;
}
