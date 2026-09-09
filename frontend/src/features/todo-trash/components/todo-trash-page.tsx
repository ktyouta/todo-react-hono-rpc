import { Loading } from "@/components";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button/scroll-to-top-button";
import { Suspense } from "react";
import { TodoTrashListContainer } from "./todo-trash-list-container";

export function TodoTrashPage() {
    return (
        <>
            <Suspense fallback={<Loading fullScreen={false} className="w-full min-h-full" />}>
                <TodoTrashListContainer />
            </Suspense>
            <ScrollToTopButton />
        </>
    );
}
