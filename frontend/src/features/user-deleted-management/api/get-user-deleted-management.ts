import { NotFoundError } from "@/lib/errors";
import { rpc } from "@/lib/rpc-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { userDeletedManagementKeys } from "./query-key";

const endpoint = rpc.api.v1['user-deleted'][':id'].$get;

// 削除済みユーザー管理詳細
export type UserDeletedManagementReturnType = InferResponseType<typeof endpoint, 200>['data'];

type PropsType = {
    id: string;
};

export function useGetUserDeletedManagement(props: PropsType) {
    return useSuspenseQuery({
        queryKey: userDeletedManagementKeys.detail(props.id),
        queryFn: async () => {
            const res = await endpoint({
                param: { id: props.id },
            });
            if (!res.ok) {
                if (res.status === 404) {
                    throw new NotFoundError();
                }
                throw Error(`削除済みユーザーの取得に失敗しました`);
            }
            return res.json();
        },
    });
}
