import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { statusKeys } from "./query-key";

const endpoint = rpc.api.v1.status.$get;

// ステータス
export type StatusReturnType = InferResponseType<typeof endpoint, 200>['data'];

export function getStatus() {

    return useSuspenseQuery({
        queryKey: statusKeys.all,
        queryFn: async () => {
            const res = await endpoint();
            if (!res.ok) {
                throw Error(`ステータスの取得に失敗しました`);
            }
            return res.json();
        },
    });
}