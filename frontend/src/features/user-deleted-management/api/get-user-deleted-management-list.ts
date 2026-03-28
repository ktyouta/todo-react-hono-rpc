import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { USER_DELETED_MANAGEMENT_QUERY_KEY } from "../constants/user-deleted-management-query-params";
import { userDeletedManagementKeys } from "./query-key";

const endpoint = rpc.api.v1['user-deleted'].$get;

// 削除済みユーザー管理一覧
export type UserDeletedManagementListReturnType = InferResponseType<typeof endpoint, 200>['data'];

type PropsType = {
    searchParams: URLSearchParams;
};

export function useGetUserDeletedManagementList({ searchParams }: PropsType) {
    return useSuspenseQuery({
        queryKey: userDeletedManagementKeys.list(searchParams),
        queryFn: async () => {
            const res = await endpoint({
                query: {
                    name: searchParams.get(USER_DELETED_MANAGEMENT_QUERY_KEY.NAME) || undefined,
                    roleId: searchParams.get(USER_DELETED_MANAGEMENT_QUERY_KEY.ROLE_ID) || undefined,
                    createdAtFrom: searchParams.get(USER_DELETED_MANAGEMENT_QUERY_KEY.CREATED_AT_FROM) || undefined,
                    createdAtTo: searchParams.get(USER_DELETED_MANAGEMENT_QUERY_KEY.CREATED_AT_TO) || undefined,
                    updatedAtFrom: searchParams.get(USER_DELETED_MANAGEMENT_QUERY_KEY.UPDATED_AT_FROM) || undefined,
                    updatedAtTo: searchParams.get(USER_DELETED_MANAGEMENT_QUERY_KEY.UPDATED_AT_TO) || undefined,
                    page: searchParams.get(USER_DELETED_MANAGEMENT_QUERY_KEY.PAGE) || undefined,
                }
            });
            if (!res.ok) {
                throw Error(`削除済みユーザー一覧の取得に失敗しました`);
            }
            return res.json();
        },
    });
}
