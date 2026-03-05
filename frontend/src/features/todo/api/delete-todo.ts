import { rpc } from '@/lib/rpc-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todoKeys } from './query-key';

const endpoint = rpc.api.v1.todo[':id'].$delete;

type PropsType = {
    id: string;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
};

export function useDeleteTodoMutation(props: PropsType) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const res = await endpoint({
                param: { id: props.id }
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: todoKeys.detail(props.id)
            });
            props.onSuccess(data.message);
        },
        onError: (error: Error) => {
            props.onError(error.message);
        },
    });
}