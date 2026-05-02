import { Loading, NotFound } from "@/components";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button/scroll-to-top-button";
import { useSubtaskId } from "@/features/todo/hooks/use-subtask-id";
import { Suspense } from "react";
import { useTaskManagementId } from "../hooks/use-task-management-id";
import { TodoManagementSubtaskDetailContainer } from "./todo-management-subtask-detail-container";

export function TodoManagementSubtaskDetailPage() {

    const taskId = useTaskManagementId();
    const subId = useSubtaskId();

    if (!/^\d+$/.test(taskId) || !/^\d+$/.test(subId)) {
        return <NotFound />;
    }

    return (
        <div className="w-full min-h-full">
            <Suspense fallback={<Loading className="w-full min-h-full" />}>
                <TodoManagementSubtaskDetailContainer />
            </Suspense>
            <ScrollToTopButton />
        </div>
    );
}
