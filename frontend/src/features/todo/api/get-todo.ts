import { NotFoundError } from "@/lib/errors";
import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { todoKeys } from "./query-key";

const endpoint = rpc.api.v1.todo[':id'].$get;

// タスク詳細
export type TaskResponseType = InferResponseType<typeof endpoint, 200>;
export type TaskDataType = InferResponseType<typeof endpoint, 200>['data'];

type PropsType = {
    id: string;
}

export function useGetTodo(props: PropsType) {

    return useSuspenseQuery({
        queryKey: todoKeys.detail(props.id),
        queryFn: async () => {
            const res = await endpoint({
                param: { id: props.id },
            });
            if (!res.ok) {

                // タスクが存在しない
                if (res.status === 404) {
                    throw new NotFoundError();
                }

                throw Error(`タスクの取得に失敗しました`);
            }
            return res.json();
        },
    });
}