import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { TODO_LIST_QUERY_KEY } from "../constants/todo-list-query-params";
import { todoKeys } from "./query-key";

const endpoint = rpc.api.v1.todo.$get;

type PropsType = {
    searchParams: URLSearchParams
};

// タスク一覧
export type TaskListReturnType = InferResponseType<typeof endpoint, 200>['data'];

export function useGetTodoList({ searchParams }: PropsType) {

    return useSuspenseQuery({
        queryKey: todoKeys.list(searchParams),
        queryFn: async () => {
            const res = await endpoint({
                query: {
                    title: searchParams.get(TODO_LIST_QUERY_KEY.TITLE) || undefined,
                    categoryId: searchParams.get(TODO_LIST_QUERY_KEY.CATEGORY) || undefined,
                    statusId: searchParams.get(TODO_LIST_QUERY_KEY.STATUS) || undefined,
                    priorityId: searchParams.get(TODO_LIST_QUERY_KEY.PRIORITY) || undefined,
                    dueDateFrom: searchParams.get(TODO_LIST_QUERY_KEY.DUE_DATE_FROM) || undefined,
                    dueDateTo: searchParams.get(TODO_LIST_QUERY_KEY.DUE_DATE_TO) || undefined,
                    createdAtFrom: searchParams.get(TODO_LIST_QUERY_KEY.CREATED_AT_FROM) || undefined,
                    createdAtTo: searchParams.get(TODO_LIST_QUERY_KEY.CREATED_AT_TO) || undefined,
                    updatedAtFrom: searchParams.get(TODO_LIST_QUERY_KEY.UPDATED_AT_FROM) || undefined,
                    updatedAtTo: searchParams.get(TODO_LIST_QUERY_KEY.UPDATED_AT_TO) || undefined,
                    page: searchParams.get(TODO_LIST_QUERY_KEY.PAGE) || undefined,
                    isFavorite: searchParams.get(TODO_LIST_QUERY_KEY.IS_FAVORITE) || undefined,
                }
            });
            if (!res.ok) {
                throw Error(`タスク一覧の取得に失敗しました`);
            }
            return res.json();
        },
    });
}