import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { importTodo, ImportTodoResponseType } from "../api/import-todo";
import { todoKeys } from "../api/query-key";

export function useTodoImport() {

    // ダイアログ開閉フラグ
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // インポート処理中フラグ
    const [isLoading, setIsLoading] = useState(false);
    // インポート結果
    const [result, setResult] = useState<ImportTodoResponseType | null>(null);
    // 選択ファイル
    const [file, setFile] = useState<File | null>(null);
    // ドラッグ中フラグ
    const [isDragging, setIsDragging] = useState(false);
    const queryClient = useQueryClient();

    /**
     * ダイアログを開く
     */
    function onOpenDialog() {
        setIsDialogOpen(true);
    }

    /**
     * ダイアログを閉じる
     */
    function onCloseDialog() {
        setIsDialogOpen(false);
        setResult(null);
        setFile(null);
    }

    /**
     * ファイル選択イベント
     */
    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFile(e.target.files?.[0] ?? null);
    }

    /**
     * ドロップイベント
     */
    function onDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped?.name.endsWith(".csv")) {
            setFile(dropped);
        }
    }

    /**
     * ドラッグオーバーイベント
     */
    function onDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(true);
    }

    /**
     * ドラッグ離脱イベント
     */
    function onDragLeave() {
        setIsDragging(false);
    }

    /**
     * アップロード実行
     */
    function onUpload() {
        if (file) onImport(file);
    }

    /**
     * CSVインポートを実行
     */
    async function onImport(file: File) {
        setIsLoading(true);
        try {
            const data = await importTodo(file);
            setResult(data);
            if (data.successCount > 0) {
                queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "CSVインポートに失敗しました。時間をおいて再度お試しください。";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isDialogOpen,
        isLoading,
        result,
        file,
        isDragging,
        onOpenDialog,
        onCloseDialog,
        onFileChange,
        onDrop,
        onDragOver,
        onDragLeave,
        onUpload,
    };
}

export type UseTodoImportReturn = ReturnType<typeof useTodoImport>;
