import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { todoKeys } from "./query-key";

const endpoint = rpc.api.v1.todo.$get;

// タスク一覧
export type TaskListType = InferResponseType<typeof endpoint, 200>['data'];

export function useGetTodoList() {

    return useSuspenseQuery({
        queryKey: todoKeys.lists(),
        queryFn: async () => {
            const res = await endpoint();
            if (!res.ok) {
                throw Error(`タスク一覧の取得に失敗しました`);
            }
            return res.json();
        },
    });
}