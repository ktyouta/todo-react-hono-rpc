import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { userListKeys } from "./query-key";

const endpoint = rpc.api.v1['user-list'].$get;

// ユーザーリスト（ドロップダウン用）
export type UserManagementListReturnType = InferResponseType<typeof endpoint, 200>['data'];

export function getUserList() {
    return useSuspenseQuery({
        queryKey: userListKeys.all,
        queryFn: async () => {
            const res = await endpoint();
            if (!res.ok) {
                throw Error(`ユーザー一覧の取得に失敗しました`);
            }
            return res.json();
        },
    });
}
