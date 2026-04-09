import { useTodoTrashList } from "../hooks/use-todo-trash-list";
import { TodoTrashList } from "./todo-trash-list";

export function TodoTrashListContainer() {
    const props = useTodoTrashList();
    return <TodoTrashList {...props} />;
}
