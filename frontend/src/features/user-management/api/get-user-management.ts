import { NotFoundError } from "@/lib/errors";
import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { userManagementKeys } from "./query-key";

const endpoint = rpc.api.v1['user-management'][':id'].$get;

export type UserManagementReturnType = InferResponseType<typeof endpoint, 200>['data'];

type PropsType = {
    id: string;
};

export function useGetUserManagement({ id }: PropsType) {
    return useSuspenseQuery({
        queryKey: userManagementKeys.detail(id),
        queryFn: async () => {
            const res = await endpoint({
                param: { id },
            });
            if (!res.ok) {
                if (res.status === 404) {
                    throw new NotFoundError();
                }
                throw Error(`ユーザーの取得に失敗しました`);
            }
            return res.json();
        },
    });
}
