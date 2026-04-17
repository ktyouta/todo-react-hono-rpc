import { rpc } from "@/lib/rpc-client";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { todoManagementKeys } from "./query-key";

const endpoint = rpc.api.v1['todo-management'][':id'].subtasks.$get;

export type ManagementSubtaskListResponseType = InferResponseType<typeof endpoint, 200>;
export type ManagementSubtaskListDataType = InferResponseType<typeof endpoint, 200>['data'];

type PropsType = {
    taskId: string;
};

export function useGetTodoManagementSubtaskList(props: PropsType) {
    return useQuery({
        queryKey: todoManagementKeys.subtaskLists(props.taskId),
        queryFn: async () => {
            const res = await endpoint({
                param: { id: props.taskId },
            });
            if (!res.ok) {
                throw Error(`サブタスク一覧の取得に失敗しました`);
            }
            return res.json();
        },
    });
}
