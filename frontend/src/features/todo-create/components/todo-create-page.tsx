import { Loading } from "@/components";
import { Suspense } from "react";
import { TodoCreateContainer } from "./create-todo-container";

export function TodoCreatePage() {
    return (
        <Suspense fallback={<Loading fullScreen={false} className="w-full min-h-full" />}>
            <TodoCreateContainer />
        </Suspense>
    );
}
