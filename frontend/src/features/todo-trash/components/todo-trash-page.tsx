import { Loading } from "@/components";
import { Suspense } from "react";
import { TodoTrashListContainer } from "./todo-trash-list-container";

export function TodoTrashPage() {
    return (
        <Suspense fallback={<Loading />}>
            <TodoTrashListContainer />
        </Suspense>
    );
}
