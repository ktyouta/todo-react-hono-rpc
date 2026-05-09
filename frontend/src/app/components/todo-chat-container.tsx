import { useRef, useState } from 'react';
import { streamTodoChat } from '../api/todo-chat';
import { TodoChatButton } from './todo-chat-button';
import { ChatMessage, TodoChatDrawer } from './todo-chat-drawer';

export function TodoChatContainer() {
    // ドロワー開閉フラグ
    const [isOpen, setIsOpen] = useState(false);
    // 会話履歴
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    // 入力値
    const [inputValue, setInputValue] = useState('');
    // ストリーミング中フラグ
    const [isStreaming, setIsStreaming] = useState(false);
    // ストリームキャンセル用コントローラー
    const abortControllerRef = useRef<AbortController | null>(null);

    /**
     * ドロワーを開く
     */
    function handleOpen() {
        setIsOpen(true);
    }

    /**
     * ドロワーを閉じる（会話履歴・入力値リセット、ストリーム中断）
     */
    function handleClose() {
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;
        setIsOpen(false);
        setMessages([]);
        setInputValue('');
        setIsStreaming(false);
    }

    /**
     * メッセージ送信
     */
    async function handleSend() {

        if (isStreaming) {
            return;
        }

        const trimmed = inputValue.trim();
        if (!trimmed) {
            return;
        }

        // ユーザーメッセージのみ先に追加する
        setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
        setInputValue('');
        setIsStreaming(true);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        await streamTodoChat(trimmed, {
            onToken: (token) => {
                setMessages(prev => {
                    const last = prev[prev.length - 1];
                    // 最初のトークン到着時は AI バブルを新規追加、以降は末尾に追記
                    if (last?.role === 'ai') {
                        return [...prev.slice(0, -1), { ...last, content: last.content + token }];
                    }
                    return [...prev, { role: 'ai', content: token }];
                });
            },
            onDone: () => {
                setIsStreaming(false);
                abortControllerRef.current = null;
            },
            onError: () => {
                setMessages(prev => [
                    ...prev,
                    {
                        role: 'ai',
                        content: 'エラーが発生しました。時間をおいて再度お試しください。',
                        isError: true,
                    },
                ]);
                setIsStreaming(false);
                abortControllerRef.current = null;
            },
            signal: controller.signal,
        });
    }

    /**
     * キーダウン（Enter送信 / Shift+Enter改行）
     */
    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    // ローディングドット表示フラグ（ストリーミング中かつ最後のメッセージがユーザー発言 = AI バブル未到着）
    const isLoading = isStreaming && messages[messages.length - 1]?.role === 'user';

    return (
        <>
            <TodoChatButton isOpen={isOpen} onClick={handleOpen} />
            <TodoChatDrawer
                isOpen={isOpen}
                messages={messages}
                inputValue={inputValue}
                isLoading={isLoading}
                isStreaming={isStreaming}
                onClose={handleClose}
                onInputChange={setInputValue}
                onSend={handleSend}
                onKeyDown={handleKeyDown}
            />
        </>
    );
}
