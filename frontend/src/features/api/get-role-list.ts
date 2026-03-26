import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { roleListKeys } from "./query-key";

const endpoint = rpc.api.v1['role-list'].$get;

// ロールリスト（ドロップダウン用）
export type RoleListReturnType = InferResponseType<typeof endpoint, 200>['data'];

export function getRoleList() {
    return useSuspenseQuery({
        queryKey: roleListKeys.all,
        queryFn: async () => {
            const res = await endpoint();
            if (!res.ok) {
                throw Error(`ロール一覧の取得に失敗しました`);
            }
            return res.json();
        },
    });
}
