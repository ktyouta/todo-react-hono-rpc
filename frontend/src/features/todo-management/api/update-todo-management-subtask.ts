import { rpc } from "@/lib/rpc-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { todoManagementKeys } from "./query-key";

const endpoint = rpc.api.v1['todo-management'][':id'].subtasks[':subId'].$patch;

type SuccessResponseType = InferResponseType<typeof endpoint, 201>;
type RequestType = InferRequestType<typeof endpoint>['json'];

type PropsType = {
    taskId: string;
    subId: string;
    onSuccess: (data: SuccessResponseType) => void;
    onError: (message: string) => void;
};

export function useUpdateTodoManagementSubtaskMutation(props: PropsType) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: RequestType) => {
            const res = await endpoint({
                param: { id: props.taskId, subId: props.subId },
                json: data,
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(Array.isArray(error.message) ? error.message.join('、') : error.message);
            }
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: todoManagementKeys.subtaskDetail(props.taskId, props.subId),
            });
            queryClient.invalidateQueries({
                queryKey: todoManagementKeys.subtaskLists(props.taskId),
            });
            props.onSuccess(data);
        },
        onError: (error: Error) => {
            props.onError(error.message);
        },
    });
}
