import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { TODO_MANAGEMENT_QUERY_KEY } from "../constants/todo-management-query-params";
import { todoManagementKeys } from "./query-key";

const endpoint = rpc.api.v1['todo-management'].$get;

// タスク管理一覧
export type TaskManagementListReturnType = InferResponseType<typeof endpoint, 200>['data'];

type PropsType = {
    searchParams: URLSearchParams;
};

export function useGetTodoManagementList({ searchParams }: PropsType) {
    return useSuspenseQuery({
        queryKey: todoManagementKeys.list(searchParams),
        queryFn: async () => {
            const res = await endpoint({
                query: {
                    userId: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.USER_ID) || undefined,
                    title: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.TITLE) || undefined,
                    categoryId: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.CATEGORY) || undefined,
                    statusId: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.STATUS) || undefined,
                    priorityId: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.PRIORITY) || undefined,
                    dueDateFrom: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.DUE_DATE_FROM) || undefined,
                    dueDateTo: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.DUE_DATE_TO) || undefined,
                    createdAtFrom: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.CREATED_AT_FROM) || undefined,
                    createdAtTo: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.CREATED_AT_TO) || undefined,
                    updatedAtFrom: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.UPDATED_AT_FROM) || undefined,
                    updatedAtTo: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.UPDATED_AT_TO) || undefined,
                    page: searchParams.get(TODO_MANAGEMENT_QUERY_KEY.PAGE) || undefined,
                }
            });
            if (!res.ok) {
                throw Error(`タスク一覧の取得に失敗しました`);
            }
            return res.json();
        },
    });
}
