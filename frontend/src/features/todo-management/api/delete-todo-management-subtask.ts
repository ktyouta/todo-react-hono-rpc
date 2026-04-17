import { rpc } from "@/lib/rpc-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoManagementKeys } from "./query-key";

const endpoint = rpc.api.v1['todo-management'][':id'].subtasks[':subId'].$delete;

type PropsType = {
    taskId: string;
    subId: string;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
};

export function useDeleteTodoManagementSubtaskMutation(props: PropsType) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const res = await endpoint({
                param: { id: props.taskId, subId: props.subId },
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: todoManagementKeys.subtaskLists(props.taskId),
            });
            props.onSuccess(data.message);
        },
        onError: (error: Error) => {
            props.onError(error.message);
        },
    });
}
