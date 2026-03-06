import { Loading, NotFound } from "@/components";
import { Suspense } from "react";
import { useTaskId } from "../hooks/use-task-id";
import { TodoDetailContainer } from "./todo-detail-container";

export function TodoDetailPage() {

    const taskId = useTaskId();

    if (!/^\d+$/.test(taskId)) {
        return <NotFound />;
    }

    return (
        <div className="w-full min-h-full">
            <Suspense
                fallback={<Loading className="w-full min-h-full" />}
            >
                <TodoDetailContainer />
            </Suspense>
        </div>
    );
}
