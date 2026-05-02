import { Loading, NotFound } from "@/components";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button/scroll-to-top-button";
import { Suspense } from "react";
import { useTodoTrashId } from "../hooks/use-todo-trash-id";
import { TodoTrashDetailContainer } from "./todo-trash-detail-container";

export function TodoTrashDetailPage() {
    const id = useTodoTrashId();

    if (!/^\d+$/.test(id)) {
        return <NotFound />;
    }

    return (
        <>
            <Suspense fallback={<Loading />}>
                <TodoTrashDetailContainer />
            </Suspense>
            <ScrollToTopButton />
        </>
    );
}
