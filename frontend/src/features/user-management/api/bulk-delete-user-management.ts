import { rpc } from "@/lib/rpc-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono/client";
import { userManagementKeys } from "./query-key";

const endpoint = rpc.api.v1["user-management"].bulk.$delete;

type ResponseType = InferResponseType<typeof endpoint, 200>;
type RequestType = InferRequestType<typeof endpoint>["json"];

type PropsType = {
    onSuccess: (data: ResponseType) => void;
    onError: (message: string) => void;
};

export function useBulkDeleteUserManagementMutation({ onSuccess, onError }: PropsType) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: RequestType) => {
            const res = await endpoint({ json: data });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: userManagementKeys.all });
            onSuccess(data);
        },
        onError: (error: Error) => {
            onError(error.message);
        },
    });
}
