import { Loading } from "@/components";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button/scroll-to-top-button";
import { Suspense } from "react";
import { TodoDeletedManagementListContainer } from "./todo-deleted-management-list-container";

export function TodoDeletedManagementPage() {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <TodoDeletedManagementListContainer />
            </Suspense>
            <ScrollToTopButton />
        </>
    );
}
