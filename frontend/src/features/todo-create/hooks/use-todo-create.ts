import { ChangeEvent, useState } from "react";

export function useTodoCreate() {

    // タイトル
    const [title, setTitle] = useState(``);
    // タスク内容
    const [content, setContent] = useState(``);

    /**
     * タイトル入力
     * @param e 
     */
    function changeTitle(e: ChangeEvent<HTMLInputElement>) {
        setTitle(e.target.value);
    }

    /**
     * タスク内容入力
     * @param e 
     */
    function changeContent(e: ChangeEvent<HTMLTextAreaElement>) {
        setContent(e.target.value);
    }

    /**
     * 作成ボタン押下
     */
    function clickCreate() {

    }

    return {
        title,
        changeTitle,
        content,
        changeContent,
        clickCreate,
    };
}