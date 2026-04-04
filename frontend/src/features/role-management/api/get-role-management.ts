import { NotFoundError } from "@/lib/errors";
import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { roleManagementKeys } from "./query-key";

const endpoint = rpc.api.v1['role-management'][':roleId'].$get;

export type RoleManagementDetailReturnType = InferResponseType<typeof endpoint, 200>['data'];

type PropsType = {
    id: string;
};

export function useGetRoleManagement({ id }: PropsType) {
    return useSuspenseQuery({
        queryKey: roleManagementKeys.detail(id),
        queryFn: async () => {
            const res = await endpoint({
                param: { roleId: id },
            });
            if (!res.ok) {
                if (res.status === 404) {
                    throw new NotFoundError();
                }
                throw Error(`ロールの取得に失敗しました`);
            }
            return res.json();
        },
    });
}
