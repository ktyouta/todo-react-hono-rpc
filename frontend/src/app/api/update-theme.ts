import { rpc } from '@/lib/rpc-client';
import { useMutation } from '@tanstack/react-query';
import type { InferRequestType } from 'hono/client';

const endpoint = rpc.api.v1['frontuser-theme'].$patch;

type RequestType = InferRequestType<typeof endpoint>;

type PropsType = {
    onError: (message: string) => void;
};

/**
 * ダークモード設定更新
 */
export function useUpdateThemeMutation(props: PropsType) {
    return useMutation({
        mutationFn: async (json: RequestType['json']) => {
            const res = await endpoint({ json });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }
            return res.json();
        },
        onError: (error: Error) => {
            props.onError(error.message);
        },
    });
}
