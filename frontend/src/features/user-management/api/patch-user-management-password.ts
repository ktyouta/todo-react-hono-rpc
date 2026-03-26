import { rpc } from "@/lib/rpc-client";
import { useMutation } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";

const endpoint = rpc.api.v1['user-management'][':id'].password.$patch;

type RequestType = InferRequestType<typeof endpoint>['json'];

type PropsType = {
    id: string;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
};

export function usePatchUserManagementPasswordMutation(props: PropsType) {
    return useMutation({
        mutationFn: async (data: RequestType) => {
            const res = await endpoint({
                json: data,
                param: { id: props.id },
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }
            return res.json();
        },
        onSuccess: (data) => {
            props.onSuccess(data.message);
        },
        onError: (error: Error) => {
            props.onError(error.message);
        },
    });
}
