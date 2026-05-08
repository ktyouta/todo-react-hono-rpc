import { useState } from 'react';
import { TodoChatResponseType, useTodoChatMutation } from '../api/todo-chat';
import { TodoChatButton } from './todo-chat-button';
import { ChatMessage, TodoChatDrawer } from './todo-chat-drawer';

export function TodoChatContainer() {
    // ドロワー開閉フラグ
    const [isOpen, setIsOpen] = useState(false);
    // 会話履歴
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    // 入力値
    const [inputValue, setInputValue] = useState('');

    // AIチャットミューテーション
    const mutation = useTodoChatMutation({
        onSuccess: (response: TodoChatResponseType) => {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: response.data.message,
            }]);
        },
        onError: () => {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: 'エラーが発生しました。時間をおいて再度お試しください。',
                isError: true,
            }]);
        },
    });

    /**
     * ドロワーを開く
     */
    function handleOpen() {
        setIsOpen(true);
    }

    /**
     * ドロワーを閉じる（会話履歴・入力値リセット）
     */
    function handleClose() {
        setIsOpen(false);
        setMessages([]);
        setInputValue('');
    }

    /**
     * メッセージ送信
     */
    function handleSend() {
        const trimmed = inputValue.trim();
        if (!trimmed || mutation.isPending) {
            return;
        }

        setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
        setInputValue('');
        mutation.mutate({ message: trimmed });
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

    return (
        <>
            <TodoChatButton isOpen={isOpen} onClick={handleOpen} />
            <TodoChatDrawer
                isOpen={isOpen}
                messages={messages}
                inputValue={inputValue}
                isLoading={mutation.isPending}
                onClose={handleClose}
                onInputChange={setInputValue}
                onSend={handleSend}
                onKeyDown={handleKeyDown}
            />
        </>
    );
}
