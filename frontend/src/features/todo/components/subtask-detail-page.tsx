import { Loading, NotFound } from "@/components";
import { Suspense } from "react";
import { useSubtaskId } from "../hooks/use-subtask-id";
import { useTaskId } from "../hooks/use-task-id";
import { SubtaskDetailContainer } from "./subtask-detail-container";

export function SubtaskDetailPage() {

    const taskId = useTaskId();
    const subId = useSubtaskId();

    if (!/^\d+$/.test(taskId) || !/^\d+$/.test(subId)) {
        return <NotFound />;
    }

    return (
        <div className="w-full min-h-full">
            <Suspense fallback={<Loading className="w-full min-h-full" />}>
                <SubtaskDetailContainer />
            </Suspense>
        </div>
    );
}
