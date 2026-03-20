import { Loading } from "@/components";
import { Suspense } from "react";
import { TodoManagementListContainer } from "./todo-management-list-container";

export function TodoManagementPage() {
    return (
        <Suspense fallback={<Loading />}>
            <TodoManagementListContainer />
        </Suspense>
    );
}
