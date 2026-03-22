import { rpc } from '@/lib/rpc-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todoKeys } from './query-key';

const endpoint = rpc.api.v1.todo[':id'].favorite.$patch;

type MutationVariables = {
    id: string;
    isFavorite: boolean;
};

type PropsType<T> = {
    onMutate?: (variables: MutationVariables) => Promise<T>;
    onError?: (context: T | undefined) => void;
};

export function useUpdateTodoFavoriteMutation<T>(props: PropsType<T>) {
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
        onMutate: props.onMutate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: todoKeys.all });
        },
        onError: (_err, _variables, context) => {
            props.onError?.(context);
        },
    });
}
