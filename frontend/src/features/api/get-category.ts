import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { categoryKeys } from "./query-key";

const endpoint = rpc.api.v1.category.$get;

// カテゴリ
export type CategoryReturnType = InferResponseType<typeof endpoint, 200>['data'];

export function getCategory() {

    return useSuspenseQuery({
        queryKey: categoryKeys.all,
        queryFn: async () => {
            const res = await endpoint();
            if (!res.ok) {
                throw Error(`カテゴリの取得に失敗しました`);
            }
            return res.json();
        },
    });
}