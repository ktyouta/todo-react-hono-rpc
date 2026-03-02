import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { todoKeys } from "./query-key";

const endpoint = rpc.api.v1.todo[':id'].$get;

// タスク一覧
export type TaskListReturnType = InferResponseType<typeof endpoint, 200>['data'];

type PropsType = {
    id: string;
}

export function useGetTodoList(props: PropsType) {

    return useSuspenseQuery({
        queryKey: todoKeys.detail(props.id),
        queryFn: async () => {
            const res = await endpoint({
                param: { id: props.id },
            });
            if (!res.ok) {
                throw Error(`タスクの取得に失敗しました`);
            }
            return res.json();
        },
    });
}