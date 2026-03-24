import { Loading } from "@/components";
import { Suspense } from "react";
import { TodoDeletedManagementListContainer } from "./todo-deleted-management-list-container";

export function TodoDeletedManagementPage() {
    return (
        <Suspense fallback={<Loading />}>
            <TodoDeletedManagementListContainer />
        </Suspense>
    );
}
