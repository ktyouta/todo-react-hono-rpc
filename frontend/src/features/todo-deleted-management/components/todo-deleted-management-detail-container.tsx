import { useTodoDeletedManagementDetail } from "../hooks/use-todo-deleted-management-detail";
import { TodoDeletedManagementDetailView } from "./todo-deleted-management-detail-view";

export function TodoDeletedManagementDetailContainer() {
    const props = useTodoDeletedManagementDetail();
    return <TodoDeletedManagementDetailView {...props} />;
}
