import { Drawer } from '@/components/ui/drawer/drawer';
import { Textarea } from '@/components/ui/textarea/textarea';
import { useEffect, useRef, useState } from 'react';
import { HiArrowUp } from 'react-icons/hi2';
import ReactMarkdown from 'react-markdown';

export type ChatMessage = {
    // メッセージの送信者
    role: 'user' | 'ai';
    // メッセージ本文
    content: string;
    // エラーメッセージフラグ
    isError?: boolean;
};

type PropsType = {
    // ドロワー開閉フラグ
    isOpen: boolean;
    // 会話履歴
    messages: ChatMessage[];
    // 入力値
    inputValue: string;
    // ローディングドット表示フラグ（最初のトークン到着前）
    isLoading: boolean;
    // ストリーミング中フラグ（フォーム無効化用）
    isStreaming: boolean;
    onClose(): void;
    onInputChange(value: string): void;
    onSend(): void;
    onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>): void;
};

function LoadingDots() {
    // アニメーション用ドット数（1〜3をループ）
    const [count, setCount] = useState(1);

    useEffect(() => {
        const id = setInterval(() => setCount(c => c === 3 ? 1 : c + 1), 400);
        return () => clearInterval(id);
    }, []);

    return <span>{'.'.repeat(count)}</span>;
}

export function TodoChatDrawer(props: PropsType) {
    // メッセージ末尾へのスクロール用ref
    const messagesEndRef = useRef<HTMLDivElement>(null);
    // テキストエリアのref（高さ自動調整用）
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [props.messages, props.isLoading]);

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) {
            return;
        }
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }, [props.inputValue]);

    return (
        <Drawer
            isOpen={props.isOpen}
            onClose={props.onClose}
            title="AIアシスタント"
            side="right"
            widthClassName="w-[90vw] lg:w-[35vw] lg:max-w-[760px]"
            className="flex flex-col"
        >
            <div className="h-full flex flex-col">
                {/* メッセージ一覧 */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2">
                    {props.messages.length === 0 && (
                        <p className="text-sm lg:text-base text-gray-400 text-center mt-8">
                            アプリの使い方や<br />タスク管理について質問してください。
                        </p>
                    )}
                    {props.messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] px-3 py-2 rounded-lg text-sm lg:text-base break-words ${msg.role === 'user'
                                    ? 'bg-cyan-500 text-white whitespace-pre-wrap'
                                    : msg.isError
                                        ? 'bg-red-50 text-red-600 border border-red-200 whitespace-pre-wrap'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                {msg.role === 'ai' && !msg.isError ? (
                                    <ReactMarkdown
                                        components={{
                                            p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                                            ul: ({ children }) => <ul className="list-disc pl-4 mb-1 space-y-0.5">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-1 space-y-0.5">{children}</ol>,
                                            li: ({ children }) => <li>{children}</li>,
                                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                            h1: ({ children }) => <p className="font-bold mb-1">{children}</p>,
                                            h2: ({ children }) => <p className="font-bold mb-1">{children}</p>,
                                            h3: ({ children }) => <p className="font-semibold mb-1">{children}</p>,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </div>
                    ))}
                    {props.isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 text-gray-500 px-3 py-2 rounded-lg text-sm lg:text-base min-w-[36px]">
                                <LoadingDots />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                {/* 入力フォーム */}
                <div className="flex gap-2 items-center border-t border-gray-200 pt-3">
                    <Textarea
                        ref={textareaRef}
                        value={props.inputValue}
                        onChange={(e) => props.onInputChange(e.target.value)}
                        onKeyDown={props.onKeyDown}
                        placeholder="質問を入力"
                        disabled={props.isStreaming}
                        disableAutoResize
                        rows={1}
                        className="flex-1 resize-none min-h-[unset] overflow-hidden"
                    />
                    <button
                        type="button"
                        onClick={props.onSend}
                        disabled={props.isStreaming || !props.inputValue.trim()}
                        aria-label="送信"
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-500 text-white shadow-md [@media(hover:hover)]:hover:bg-cyan-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                    >
                        <HiArrowUp className="size-5" />
                    </button>
                </div>
            </div>
        </Drawer>
    );
}
