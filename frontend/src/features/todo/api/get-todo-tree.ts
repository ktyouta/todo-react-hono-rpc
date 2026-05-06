import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { todoKeys } from "./query-key";

const endpoint = rpc.api.v1.todo[":id"].tree.$get;

// タスクツリー
export type TodoTreeResponseType = InferResponseType<typeof endpoint, 200>;
export type TodoTreeItemType = InferResponseType<typeof endpoint, 200>["data"][number];

type PropsType = {
    id: string;
};

export function useGetTodoTree(props: PropsType) {
    return useSuspenseQuery({
        queryKey: todoKeys.tree(props.id),
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
