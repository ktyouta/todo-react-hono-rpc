import { rpc } from '@/lib/rpc-client';
import { useMutation } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono/client';

const endpoint = rpc.api.v1["todo-chat"].$post;

export type TodoChatResponseType = InferResponseType<typeof endpoint, 200>;
type RequestType = InferRequestType<typeof endpoint>['json'];

type PropsType = {
    onSuccess: (response: TodoChatResponseType) => void;
    onError: () => void;
};

export function useTodoChatMutation(props: PropsType) {
    return useMutation({
        mutationFn: async (data: RequestType) => {
            const res = await endpoint({ json: data });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(Array.isArray(error.message) ? error.message.join(', ') : error.message);
            }
            return res.json() as Promise<TodoChatResponseType>;
        },
        onSuccess: (response) => {
            props.onSuccess(response);
        },
        onError: () => {
            props.onError();
        },
    });
}
