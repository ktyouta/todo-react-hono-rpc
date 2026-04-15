import { rpc } from "@/lib/rpc-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { todoKeys } from "./query-key";

const endpoint = rpc.api.v1.todo[':id'].subtasks.$post;

type RequestType = InferRequestType<typeof endpoint>['json'];

type PropsType = {
    taskId: string;
    onSuccess: () => void;
    onError: (message: string) => void;
};

export function useCreateSubtaskMutation(props: PropsType) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: RequestType) => {
            const res = await endpoint({
                param: { id: props.taskId },
                json: data,
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(Array.isArray(error.message) ? error.message.join('、') : error.message);
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: todoKeys.subtaskLists(props.taskId),
            });
            props.onSuccess();
        },
        onError: (error: Error) => {
            props.onError(error.message);
        },
    });
}
