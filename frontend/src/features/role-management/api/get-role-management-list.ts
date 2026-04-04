import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { ROLE_MANAGEMENT_QUERY_KEY } from "../constants/role-management-query-params";
import { roleManagementKeys } from "./query-key";

const endpoint = rpc.api.v1['role-management'].$get;

export type RoleManagementListReturnType = InferResponseType<typeof endpoint, 200>['data'];

type PropsType = {
    searchParams: URLSearchParams;
};

export function useGetRoleManagementList({ searchParams }: PropsType) {
    return useSuspenseQuery({
        queryKey: roleManagementKeys.list(searchParams),
        queryFn: async () => {
            const res = await endpoint({
                query: {
                    name: searchParams.get(ROLE_MANAGEMENT_QUERY_KEY.NAME) || undefined,
                    page: searchParams.get(ROLE_MANAGEMENT_QUERY_KEY.PAGE) || undefined,
                },
            });
            if (!res.ok) {
                throw Error(`ロール一覧の取得に失敗しました`);
            }
            return res.json();
        },
    });
}
