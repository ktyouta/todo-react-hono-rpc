import { useTodoTrashDetail } from "../hooks/use-todo-trash-detail";
import { TodoTrashDetailView } from "./todo-trash-detail-view";

export function TodoTrashDetailContainer() {
    const props = useTodoTrashDetail();
    return <TodoTrashDetailView {...props} />;
}
