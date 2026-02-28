import { Loading } from "@/components";
import { Suspense } from "react";
import { TodoListContainer } from "./todo-list-container";

export function Todo() {

    return (
        <div className="w-full min-h-full">
            <Suspense
                fallback={<Loading className="w-full min-h-full" />}
            >
                <TodoListContainer />
            </Suspense>
        </div>
    );
}