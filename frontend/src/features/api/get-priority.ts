import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { priorityKeys } from "./query-key";

const endpoint = rpc.api.v1.priority.$get;

// 優先度
export type PriorityReturnType = InferResponseType<typeof endpoint, 200>['data'];

export function getPriority() {

    return useSuspenseQuery({
        queryKey: priorityKeys.all,
        queryFn: async () => {
            const res = await endpoint();
            if (!res.ok) {
                throw Error(`優先度の取得に失敗しました`);
            }
            return res.json();
        },
    });
}