import { useTodoDeletedManagementList } from "../hooks/use-todo-deleted-management-list";
import { TodoDeletedManagementList } from "./todo-deleted-management-list";

export function TodoDeletedManagementListContainer() {
    const props = useTodoDeletedManagementList();
    return <TodoDeletedManagementList {...props} />;
}
