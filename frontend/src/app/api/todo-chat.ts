import { apiPaths } from '@/config/api-paths';
import { env } from '@/config/env';
import { getAccessToken, handleRefresh } from '@/lib/refresh-handler';
import { z } from 'zod';

const SseTokenSchema = z.object({
    token: z.string(),
});

type StreamCallbacks = {
    onToken: (token: string) => void;
    onDone: () => void;
    onError: (error: Error) => void;
    signal: AbortSignal;
};

/**
 * AIチャットのストリーミングリクエスト
 * ストリームは RPC で実現できないため fetch を直接使用
 */
export async function streamTodoChat(message: string, callbacks: StreamCallbacks): Promise<void> {
    const { onToken, onDone, onError, signal } = callbacks;

    async function doFetch(accessToken: string | null): Promise<Response> {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return fetch(`${env.API_URL}${apiPaths.todoChat}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ message }),
            credentials: 'include',
            signal,
        });
    }

    let response: Response;
    try {
        response = await doFetch(getAccessToken());
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return;
            }
            onError(error);
        }
        return;
    }

    // 401 の場合はリフレッシュしてリトライ
    if (response.status === 401) {
        try {
            const newToken = await handleRefresh();
            response = await doFetch(newToken);
        } catch {
            onError(new Error('認証エラーが発生しました'));
            return;
        }
    }

    if (!response.ok) {
        onError(new Error('AIの応答取得に失敗しました'));
        return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
        onError(new Error('ストリームの取得に失敗しました'));
        return;
    }

    const decoder = new TextDecoder();
    // チャンク境界をまたぐ場合に備えてバッファリング
    let buffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith('data: ')) {
                    continue;
                }

                const data = trimmed.slice(6);
                if (data === '[DONE]') {
                    onDone();
                    return;
                }

                try {
                    const result = SseTokenSchema.safeParse(JSON.parse(data));
                    if (result.success) {
                        onToken(result.data.token);
                    }
                } catch {
                    // JSON.parse 失敗は無視
                }
            }
        }
        onDone();
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return;
            }
            onError(error);
        }
    }
}
