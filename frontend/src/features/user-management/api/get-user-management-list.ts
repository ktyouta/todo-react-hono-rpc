import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { USER_MANAGEMENT_QUERY_KEY } from "../constants/user-management-query-params";
import { userManagementKeys } from "./query-key";

const endpoint = rpc.api.v1['user-management'].$get;

export type UserManagementListReturnType = InferResponseType<typeof endpoint, 200>['data'];

type PropsType = {
    searchParams: URLSearchParams;
};

export function useGetUserManagementList({ searchParams }: PropsType) {
    return useSuspenseQuery({
        queryKey: userManagementKeys.list(searchParams),
        queryFn: async () => {
            const res = await endpoint({
                query: {
                    name: searchParams.get(USER_MANAGEMENT_QUERY_KEY.NAME) || undefined,
                    roleId: searchParams.get(USER_MANAGEMENT_QUERY_KEY.ROLE_ID) || undefined,
                    createdAtFrom: searchParams.get(USER_MANAGEMENT_QUERY_KEY.CREATED_AT_FROM) || undefined,
                    createdAtTo: searchParams.get(USER_MANAGEMENT_QUERY_KEY.CREATED_AT_TO) || undefined,
                    updatedAtFrom: searchParams.get(USER_MANAGEMENT_QUERY_KEY.UPDATED_AT_FROM) || undefined,
                    updatedAtTo: searchParams.get(USER_MANAGEMENT_QUERY_KEY.UPDATED_AT_TO) || undefined,
                    page: searchParams.get(USER_MANAGEMENT_QUERY_KEY.PAGE) || undefined,
                },
            });
            if (!res.ok) {
                throw Error(`ユーザー一覧の取得に失敗しました`);
            }
            return res.json();
        },
    });
}
