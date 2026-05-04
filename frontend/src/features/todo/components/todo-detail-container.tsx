import { useTodoDetail } from "../hooks/use-todo-detail";
import { TodoDetailEdit } from "./todo-detail-edit";
import { TodoDetailView } from "./todo-detail-view";

export function TodoDetailContainer() {

    const props = useTodoDetail();

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