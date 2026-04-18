import { useTodoDeletedManagementSubtaskSection } from "../hooks/use-todo-deleted-management-subtask-section";
import { TodoDeletedManagementSubtaskSection } from "./todo-deleted-management-subtask-section";

export function TodoDeletedManagementSubtaskSectionContainer() {

    const props = useTodoDeletedManagementSubtaskSection();

    return (
        <TodoDeletedManagementSubtaskSection
            {...props}
        />
    );
}
