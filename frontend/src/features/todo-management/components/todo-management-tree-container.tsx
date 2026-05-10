import { useTodoManagementTree } from "../hooks/use-todo-management-tree";
import { TodoManagementTreeView } from "./todo-management-tree-view";

export function TodoManagementTreeContainer() {

    const props = useTodoManagementTree();

    return (
        <TodoManagementTreeView
            {...props}
        />
    );
}
