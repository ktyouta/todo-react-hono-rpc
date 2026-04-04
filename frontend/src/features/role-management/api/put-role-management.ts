import { rpc } from "@/lib/rpc-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";
import { roleManagementKeys } from "./query-key";

const endpoint = rpc.api.v1['role-management'][':roleId'].$put;

type RequestType = InferRequestType<typeof endpoint>["json"];

type PropsType = {
    id: string;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
};

export function usePutRoleManagementMutation(props: PropsType) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: RequestType) => {
            const res = await endpoint({
                param: { roleId: props.id },
                json: data,
            });
            if (!res.ok) {
                const error = await res.json();
                const message = Array.isArray(error.message)
                    ? error.message.join("\n")
                    : error.message;
                throw new Error(message);
            }
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: roleManagementKeys.all });
            props.onSuccess(data.message);
        },
        onError: (error: Error) => {
            props.onError(error.message);
        },
    });
}
