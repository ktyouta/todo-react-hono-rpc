import { NotFoundError } from "@/lib/errors";
import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { todoManagementKeys } from "./query-key";

const endpoint = rpc.api.v1['todo-management'][':id'].$get;

// タスク管理詳細
export type TaskManagementReturnType = InferResponseType<typeof endpoint, 200>['data'];

type PropsType = {
    id: string;
};

export function useGetTodoManagement(props: PropsType) {
    return useSuspenseQuery({
        queryKey: todoManagementKeys.detail(props.id),
        queryFn: async () => {
            const res = await endpoint({
                param: { id: props.id },
            });
            if (!res.ok) {
                if (res.status === 404) {
                    throw new NotFoundError();
                }
                throw Error(`タスクの取得に失敗しました`);
            }
            return res.json();
        },
    });
}
