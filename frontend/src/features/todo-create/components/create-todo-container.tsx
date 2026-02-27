import { useTodoCreate } from "../hooks/use-todo-create";
import { TodoCreate } from "./todo-create";

export function TodoCreateContainer() {

    const props = useTodoCreate();

    return (
        <TodoCreate
            {...props}
        />
    );
}
