import { NotFoundError } from "@/lib/errors";
import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { todoKeys } from "./query-key";

const endpoint = rpc.api.v1.todo[':id'].subtasks[':subId'].$get;

export type SubtaskResponseType = InferResponseType<typeof endpoint, 200>;
export type SubtaskDataType = InferResponseType<typeof endpoint, 200>['data'];

type PropsType = {
    taskId: string;
    subId: string;
};

export function useGetSubtask(props: PropsType) {
    return useSuspenseQuery({
        queryKey: todoKeys.subtaskDetail(props.taskId, props.subId),
        queryFn: async () => {
            const res = await endpoint({
                param: { id: props.taskId, subId: props.subId },
            });
            if (!res.ok) {
                if (res.status === 404) {
                    throw new NotFoundError();
                }
                throw Error(`サブタスクの取得に失敗しました`);
            }
            return res.json();
        },
    });
}
