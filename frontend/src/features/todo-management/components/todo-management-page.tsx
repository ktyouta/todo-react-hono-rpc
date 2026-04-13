import { Loading } from "@/components";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button/scroll-to-top-button";
import { Suspense } from "react";
import { TodoManagementListContainer } from "./todo-management-list-container";

export function TodoManagementPage() {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <TodoManagementListContainer />
            </Suspense>
            <ScrollToTopButton />
        </>
    );
}
