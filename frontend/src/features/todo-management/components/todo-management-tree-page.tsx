import { Loading, NotFound } from "@/components";
import { Suspense } from "react";
import { useTaskManagementId } from "../hooks/use-task-management-id";
import { TodoManagementTreeContainer } from "./todo-management-tree-container";

export function TodoManagementTreePage() {
    // タスクID
    const taskId = useTaskManagementId();

    if (!/^\d+$/.test(taskId)) {
        return <NotFound />;
    }

    return (
        <div className="w-full h-full">
            <Suspense fallback={<Loading className="w-full h-full" />}>
                <TodoManagementTreeContainer />
            </Suspense>
        </div>
    );
}
