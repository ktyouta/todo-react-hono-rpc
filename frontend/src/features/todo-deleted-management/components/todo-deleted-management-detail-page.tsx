import { Loading, NotFound } from "@/components";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button/scroll-to-top-button";
import { Suspense } from "react";
import { useTodoDeletedManagementId } from "../hooks/use-todo-deleted-management-id";
import { TodoDeletedManagementDetailContainer } from "./todo-deleted-management-detail-container";

export function TodoDeletedManagementDetailPage() {
    const id = useTodoDeletedManagementId();

    if (!/^\d+$/.test(id)) {
        return <NotFound />;
    }

    return (
        <>
            <Suspense fallback={<Loading fullScreen={false} className="w-full min-h-full" />}>
                <TodoDeletedManagementDetailContainer />
            </Suspense>
            <ScrollToTopButton />
        </>
    );
}
