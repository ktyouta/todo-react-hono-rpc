import { useTodoManagementList } from "../hooks/use-todo-management-list";
import { TodoManagementList } from "./todo-management-list";

export function TodoManagementListContainer() {
    const props = useTodoManagementList();
    return <TodoManagementList {...props} />;
}
