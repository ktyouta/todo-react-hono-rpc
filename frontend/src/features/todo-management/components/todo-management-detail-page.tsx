import { Loading, NotFound } from "@/components";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button/scroll-to-top-button";
import { Suspense } from "react";
import { TodoManagementDetailContainer } from "./todo-management-detail-container";
import { useTaskManagementId } from "../hooks/use-task-management-id";

export function TodoManagementDetailPage() {
    const id = useTaskManagementId();

    if (!/^\d+$/.test(id)) {
        return <NotFound />;
    }

    return (
        <>
            <Suspense fallback={<Loading />}>
                <TodoManagementDetailContainer />
            </Suspense>
            <ScrollToTopButton />
        </>
    );
}
