import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { todoTrashKeys } from "./query-key";

const endpoint = rpc.api.v1.todo.trash[":id"].$get;

export type TodoTrashReturnType = InferResponseType<typeof endpoint, 200>['data'];

type PropsType = {
    id: string;
};

export function useGetTodoTrash({ id }: PropsType) {
    return useSuspenseQuery({
        queryKey: todoTrashKeys.detail(id),
        queryFn: async () => {
            const res = await endpoint({ param: { id } });
            if (!res.ok) {
                throw Error(`タスク(ゴミ箱)の取得に失敗しました`);
            }
            return res.json();
        },
    });
}
