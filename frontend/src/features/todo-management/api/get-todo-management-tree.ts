import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { todoManagementKeys } from "./query-key";

const endpoint = rpc.api.v1["todo-management"][":id"].tree.$get;

// タスクツリー（管理者用）
export type TodoManagementTreeResponseType = InferResponseType<typeof endpoint, 200>;
export type TodoManagementTreeItemType = InferResponseType<typeof endpoint, 200>["data"][number];

type PropsType = {
    id: string;
};

export function useGetTodoManagementTree(props: PropsType) {
    return useSuspenseQuery({
        queryKey: todoManagementKeys.tree(props.id),
        queryFn: async () => {
            const res = await endpoint({
                param: { id: props.id },
            });
            if (!res.ok) {
                throw new Error("タスクツリーの取得に失敗しました");
            }
            return res.json();
        },
    });
}
