import { Loading, NotFound } from "@/components";
import { Suspense } from "react";
import { useTodoTrashId } from "../hooks/use-todo-trash-id";
import { TodoTrashDetailContainer } from "./todo-trash-detail-container";

export function TodoTrashDetailPage() {
    const id = useTodoTrashId();

    if (!/^\d+$/.test(id)) {
        return <NotFound />;
    }

    return (
        <Suspense fallback={<Loading />}>
            <TodoTrashDetailContainer />
        </Suspense>
    );
}
