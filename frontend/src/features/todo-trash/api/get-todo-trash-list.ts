import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { TODO_TRASH_QUERY_KEY } from "../constants/todo-trash-query-params";
import { todoTrashKeys } from "./query-key";

const endpoint = rpc.api.v1.todo.trash.$get;

export type TodoTrashListReturnType = InferResponseType<typeof endpoint, 200>['data'];

type PropsType = {
    searchParams: URLSearchParams;
};

export function useGetTodoTrashList({ searchParams }: PropsType) {
    return useSuspenseQuery({
        queryKey: todoTrashKeys.list(searchParams),
        queryFn: async () => {
            const res = await endpoint({
                query: {
                    title: searchParams.get(TODO_TRASH_QUERY_KEY.TITLE) || undefined,
                    categoryId: searchParams.get(TODO_TRASH_QUERY_KEY.CATEGORY) || undefined,
                    statusId: searchParams.get(TODO_TRASH_QUERY_KEY.STATUS) || undefined,
                    priorityId: searchParams.get(TODO_TRASH_QUERY_KEY.PRIORITY) || undefined,
                    dueDateFrom: searchParams.get(TODO_TRASH_QUERY_KEY.DUE_DATE_FROM) || undefined,
                    dueDateTo: searchParams.get(TODO_TRASH_QUERY_KEY.DUE_DATE_TO) || undefined,
                    updatedAtFrom: searchParams.get(TODO_TRASH_QUERY_KEY.UPDATED_AT_FROM) || undefined,
                    updatedAtTo: searchParams.get(TODO_TRASH_QUERY_KEY.UPDATED_AT_TO) || undefined,
                    page: searchParams.get(TODO_TRASH_QUERY_KEY.PAGE) || undefined,
                }
            });
            if (!res.ok) {
                throw Error(`タスク一覧(ゴミ箱)の取得に失敗しました`);
            }
            return res.json();
        },
    });
}
