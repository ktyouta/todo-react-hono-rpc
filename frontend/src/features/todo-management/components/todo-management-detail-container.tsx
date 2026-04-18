import { paths } from "@/config/paths";
import { Navigate } from "react-router-dom";
import { useTodoManagementDetail } from "../hooks/use-todo-management-detail";
import { TodoManagementDetailEdit } from "./todo-management-detail-edit";
import { TodoManagementDetailView } from "./todo-management-detail-view";

export function TodoManagementDetailContainer() {

    const props = useTodoManagementDetail();
    const parentId = props.task.parentId;
    const id = props.task.id

    // サブタスクの場合
    if (parentId) {
        return (
            <Navigate
                to={paths.todoManagementSubtaskDetail.getHref(parentId, id)}
                replace
            />
        );
    }

    if (props.isEditMode) {
        return <TodoManagementDetailEdit {...props} />;
    }

    return <TodoManagementDetailView {...props} />;
}
