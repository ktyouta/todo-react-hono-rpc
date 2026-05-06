import { useTodoTree } from "../hooks/use-todo-tree";
import { TodoTreeView } from "./todo-tree-view";

export function TodoTreeContainer() {

    const props = useTodoTree();

    return (
        <TodoTreeView
            {...props}
        />
    );
}
