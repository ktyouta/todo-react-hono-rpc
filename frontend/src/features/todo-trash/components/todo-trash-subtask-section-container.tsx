import { useTodoTrashSubtaskSection } from "../hooks/use-todo-trash-subtask-section";
import { TodoTrashSubtaskSection } from "./todo-trash-subtask-section";

export function TodoTrashSubtaskSectionContainer() {

    const props = useTodoTrashSubtaskSection();

    return (
        <TodoTrashSubtaskSection
            {...props}
        />
    );
}
