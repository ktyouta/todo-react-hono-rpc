import { useTodoDetail } from "../hooks/use-todo-detail";
import { TodoDetail } from "./todo-detail";

export function TodoDetailContainer() {

    const props = useTodoDetail();

    return (
        <TodoDetail
            {...props}
        />
    );
}