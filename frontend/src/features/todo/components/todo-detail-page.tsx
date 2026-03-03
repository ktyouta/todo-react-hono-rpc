import { Loading, NotFound } from "@/components";
import { Suspense } from "react";
import { useParams } from "react-router-dom";
import { TodoDetailContainer } from "./todo-detail-container";

export function TodoDetailPage() {

    const { id } = useParams();

    if (!id || !/^\d+$/.test(id)) {
        return <NotFound />;
    }

    return (
        <div className="w-full min-h-full">
            <Suspense
                fallback={<Loading className="w-full min-h-full" />}
            >
                <TodoDetailContainer />
            </Suspense>
        </div>
    );
}
