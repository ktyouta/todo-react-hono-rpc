import { rpc } from '@/lib/rpc-client';
import { useMutation } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono/client';

const endpoint = rpc.api.v1["todo-assist"].$post;

export type TodoAssistResponseType = InferResponseType<typeof endpoint, 200>;
type RequestType = InferRequestType<typeof endpoint>['json'];

type PropsType = {
    onSuccess: (response: TodoAssistResponseType) => void;
    onError: (message: string) => void;
};

export function useTodoAssistMutation(props: PropsType) {
    return useMutation({
        mutationFn: async (data: RequestType) => {
            const res = await endpoint({ json: data });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }
            return await res.json();
        },
        onSuccess: (response) => {
            props.onSuccess(response);
        },
        onError: (error: Error) => {
            props.onError(error.message);
        },
    });
}
