import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import { permissionListKeys } from "./query-key";

const endpoint = rpc.api.v1["permission-list"].$get;

export type PermissionListReturnType = InferResponseType<typeof endpoint, 200>["data"];

export function getPermissionList() {
    return useSuspenseQuery({
        queryKey: permissionListKeys.all,
        queryFn: async () => {
            const res = await endpoint();
            if (!res.ok) {
                throw new Error("パーミッション一覧の取得に失敗しました");
            }
            return res.json();
        },
    });
}
