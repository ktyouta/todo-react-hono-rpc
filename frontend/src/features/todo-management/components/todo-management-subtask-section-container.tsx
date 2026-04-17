import { useTodoManagementSubtaskSection } from "../hooks/use-todo-management-subtask-section";
import { TodoManagementSubtaskSection } from "./todo-management-subtask-section";

export function TodoManagementSubtaskSectionContainer() {

    const props = useTodoManagementSubtaskSection();

    return (
        <TodoManagementSubtaskSection
            {...props}
        />
    );
}
