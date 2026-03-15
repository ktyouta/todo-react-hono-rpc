import { useTodoCreate } from "../hooks/use-todo-create";
import { TodoCreate } from "./todo-create";
import { TodoCreateComplete } from "./todo-create-complete";

export function TodoCreateContainer() {

    const props = useTodoCreate();

    // タスク完了
    if (props.isCompleted) {
        return (
            <TodoCreateComplete
                {...props}
            />
        );
    }

    return (
        <TodoCreate
            {...props}
        />
    );
}
