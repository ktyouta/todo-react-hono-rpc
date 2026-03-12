import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { TodoSearchFilter } from "../types/todo-search-filter";
import { todoKeys } from "./query-key";

const endpoint = rpc.api.v1.todo.$get;

type PropsType = TodoSearchFilter;

// タスク一覧
export type TaskListReturnType = InferResponseType<typeof endpoint, 200>['data'];

export function useGetTodoList(props: PropsType) {

    return useSuspenseQuery({
        queryKey: todoKeys.list(props),
        queryFn: async () => {
            const res = await endpoint({
                query: {
                    title: props.title || undefined,
                    categoryId: props.categoryId || undefined,
                    statusId: props.statusId || undefined,
                    priorityId: props.priorityId || undefined,
                    dueDateFrom: props.dueDateFrom || undefined,
                    dueDateTo: props.dueDateTo || undefined,
                    createdAtFrom: props.createdAtFrom || undefined,
                    createdAtTo: props.createdAtTo || undefined,
                    updatedAtFrom: props.updatedAtFrom || undefined,
                    updatedAtTo: props.updatedAtTo || undefined,
                }
            });
            if (!res.ok) {
                throw Error(`タスク一覧の取得に失敗しました`);
            }
            return res.json();
        },
    });
}