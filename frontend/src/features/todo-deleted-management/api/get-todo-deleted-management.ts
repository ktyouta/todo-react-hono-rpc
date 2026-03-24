import { NotFoundError } from "@/lib/errors";
import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { todoDeletedManagementKeys } from "./query-key";

const endpoint = rpc.api.v1['todo-deleted'][':id'].$get;

// 削除済みタスク管理詳細
export type TodoDeletedManagementReturnType = InferResponseType<typeof endpoint, 200>['data'];

type PropsType = {
    id: string;
};

export function useGetTodoDeletedManagement(props: PropsType) {
    return useSuspenseQuery({
        queryKey: todoDeletedManagementKeys.detail(props.id),
        queryFn: async () => {
            const res = await endpoint({
                param: { id: props.id },
            });
            if (!res.ok) {
                if (res.status === 404) {
                    throw new NotFoundError();
                }
                throw Error(`削除済みタスクの取得に失敗しました`);
            }
            return res.json();
        },
    });
}
