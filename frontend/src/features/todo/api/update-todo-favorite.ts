import { rpc } from '@/lib/rpc-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todoKeys } from './query-key';

const endpoint = rpc.api.v1.todo[':id'].favorite.$patch;

type MutationVariables = {
    id: string;
    isFavorite: boolean;
};

type PropsType = {
    onError?: () => void;
};

export function useUpdateTodoFavoriteMutation(props?: PropsType) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, isFavorite }: MutationVariables) => {
            const res = await endpoint({
                json: { isFavorite },
                param: { id }
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: todoKeys.all });
        },
        onError: () => {
            props?.onError?.();
        },
    });
}
