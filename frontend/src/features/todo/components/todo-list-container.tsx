import { useTodoList } from "../hooks/use-todo-list";
import { TodoList } from "./todo-list";


export function TodoListContainer() {

    const props = useTodoList();

    return (
        <TodoList
            {...props}
        />
    );
}