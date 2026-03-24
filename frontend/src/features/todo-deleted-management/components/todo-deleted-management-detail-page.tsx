import { Loading, NotFound } from "@/components";
import { Suspense } from "react";
import { useTodoDeletedManagementId } from "../hooks/use-todo-deleted-management-id";
import { TodoDeletedManagementDetailContainer } from "./todo-deleted-management-detail-container";

export function TodoDeletedManagementDetailPage() {
    const id = useTodoDeletedManagementId();

    if (!/^\d+$/.test(id)) {
        return <NotFound />;
    }

    return (
        <Suspense fallback={<Loading />}>
            <TodoDeletedManagementDetailContainer />
        </Suspense>
    );
}
