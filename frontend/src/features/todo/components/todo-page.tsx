import { Loading } from "@/components";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button/scroll-to-top-button";
import { Suspense } from "react";
import { TodoListContainer } from "./todo-list-container";

export function TodoPage() {

    return (
        <div className="w-full min-h-full">
            <Suspense
                fallback={<Loading className="w-full min-h-full" />}
            >
                <TodoListContainer />
            </Suspense>
            <ScrollToTopButton />
        </div>
    );
}