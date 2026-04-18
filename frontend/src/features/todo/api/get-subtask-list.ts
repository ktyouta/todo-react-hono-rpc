import { rpc } from "@/lib/rpc-client";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { todoKeys } from "./query-key";

const endpoint = rpc.api.v1.todo[':id'].subtasks.$get;

export type SubtaskListResponseType = InferResponseType<typeof endpoint, 200>;
export type SubtaskListDataType = InferResponseType<typeof endpoint, 200>['data']['list'];

type PropsType = {
    taskId: string;
    page: number;
};

export function useGetSubtaskList(props: PropsType) {
    return useQuery({
        queryKey: todoKeys.subtaskList(props.taskId, props.page),
        queryFn: async () => {
            const res = await endpoint({
                param: { id: props.taskId },
                query: { page: String(props.page) },
            });
            if (!res.ok) {
                throw Error(`サブタスク一覧の取得に失敗しました`);
            }
            return res.json();
        },
    });
}
