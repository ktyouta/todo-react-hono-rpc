import { rpc } from "@/lib/rpc-client";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { todoKeys } from "./query-key";

const endpoint = rpc.api.v1.todo[':id'].subtasks.$get;

export type SubtaskListResponseType = InferResponseType<typeof endpoint, 200>;
export type SubtaskListDataType = InferResponseType<typeof endpoint, 200>['data'];

type PropsType = {
    taskId: string;
};

export function useGetSubtaskList(props: PropsType) {
    return useQuery({
        queryKey: todoKeys.subtaskLists(props.taskId),
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
