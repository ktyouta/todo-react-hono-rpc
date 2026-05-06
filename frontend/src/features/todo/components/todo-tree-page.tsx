import { Loading, NotFound } from "@/components";
import { Suspense } from "react";
import { useTaskId } from "../hooks/use-task-id";
import { TodoTreeContainer } from "./todo-tree-container";

export function TodoTreePage() {
    // タスクID
    const taskId = useTaskId();

    if (!/^\d+$/.test(taskId)) {
        return <NotFound />;
    }

    return (
        <div className="w-full h-full">
            <Suspense fallback={<Loading className="w-full h-full" />}>
                <TodoTreeContainer />
            </Suspense>
        </div>
    );
}
