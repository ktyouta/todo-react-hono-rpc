import { paths } from "@/config/paths";
import { Navigate } from "react-router-dom";
import { useTodoDetail } from "../hooks/use-todo-detail";
import { TodoDetailEdit } from "./todo-detail-edit";
import { TodoDetailView } from "./todo-detail-view";

export function TodoDetailContainer() {

    const props = useTodoDetail();
    const parentId = props.task.parentId;
    const id = props.task.id

    // サブタスクの場合
    if (parentId) {
        return (
            <Navigate
                to={paths.subtaskDetail.getHref(parentId, id)}
                replace
            />
        );
    }

    // 編集モード
    if (props.isEditMode) {
        return (
            <TodoDetailEdit
                {...props}
            />
        );
    }

    return (
        <TodoDetailView
            {...props}
        />
    );
}