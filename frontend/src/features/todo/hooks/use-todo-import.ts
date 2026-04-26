import { useQueryClient } from "@tanstack/react-query";
import Papa from "papaparse";
import { useState } from "react";
import { toast } from "react-toastify";
import { importTodo, ImportTodoResponseType } from "../api/import-todo";
import { todoKeys } from "../api/query-key";

const CSV_COLUMN_COUNT = 13;
const CSV_DATA_START_ROW = 2;
const VALID_CATEGORY_IDS = [1, 2];
const VALID_STATUS_IDS = [1, 2, 3];
const VALID_PRIORITY_IDS = [1, 2, 3];

export type CsvPreviewRow = {
    id: number;
    csvId: string;
    title: string;
    categoryName: string;
    statusName: string;
    priorityName: string;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    isFavorite: string;
    hasError: boolean;
};

export type CsvValidationError = {
    rowNumber: number;
    id: string | null;
    message: string;
};

/**
 * CSVテキストを変換する
 */
function parseCsvText(csvText: string): string[][] {

    const result = Papa.parse<string[]>(csvText.replace(/^﻿/, ""), {
        skipEmptyLines: true,
    });

    // ヘッダー行（1行目）を読み飛ばす
    return result.data.slice(1);
}

/**
 * バリデーションチェック
 */
function validateCsvRow(cols: string[], idCounts: Map<string, number>): string | null {

    if (cols.length < CSV_COLUMN_COUNT) {
        return 'カラム数が不正です'
    }

    const id = cols[0]?.trim() ?? '';
    if (!id) {
        return 'IDが入力されていません';
    }

    const idNum = Number(id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
        return 'IDが不正です（正の整数を入力してください）';
    }

    if ((idCounts.get(id) ?? 0) > 1) {
        return 'IDが重複しています';
    }

    const title = cols[1]?.trim() ?? '';
    if (!title) {
        return 'タイトルを入力してください';
    }

    if (title.length > 200) {
        return 'タイトルは200文字以内で入力してください';
    }

    const content = cols[2]?.trim() ?? '';
    if (!content) {
        return '内容を入力してください';
    }

    if (content.length > 2000) {
        return '内容は2000文字以内で入力してください';
    }

    const categoryStr = cols[3]?.trim() ?? '';
    const categoryId = categoryStr ? Number(categoryStr) : NaN;
    if (!Number.isInteger(categoryId) || !VALID_CATEGORY_IDS.includes(categoryId)) {
        return `カテゴリIDが不正です（使用可能な値: ${VALID_CATEGORY_IDS.join(', ')}）`;
    }

    const statusStr = cols[5]?.trim() ?? '';
    if (statusStr) {
        const statusId = Number(statusStr);
        if (!Number.isInteger(statusId) || !VALID_STATUS_IDS.includes(statusId)) {
            return `ステータスIDが不正です（使用可能な値: 空欄, ${VALID_STATUS_IDS.join(', ')}）`;
        }
    }

    const priorityStr = cols[7]?.trim() ?? '';
    if (priorityStr) {
        const priorityId = Number(priorityStr);
        if (!Number.isInteger(priorityId) || !VALID_PRIORITY_IDS.includes(priorityId)) {
            return `優先度IDが不正です（使用可能な値: 空欄, ${VALID_PRIORITY_IDS.join(', ')}）`;
        }
    }

    const dueDate = cols[9]?.trim() ?? '';
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
        return '期日はYYYY-MM-DD形式で入力してください';
    }

    const favorite = cols[10]?.trim() ?? '';
    if (favorite !== '0' && favorite !== '1') {
        return 'お気に入りは0または1で入力してください';
    }

    return null;
}

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
    // 説明セクション開閉フラグ
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
    // CSVプレビュー行（null = ファイル未選択）
    const [previewRows, setPreviewRows] = useState<CsvPreviewRow[] | null>(null);
    // フロントバリデーションエラー
    const [previewErrors, setPreviewErrors] = useState<CsvValidationError[]>([]);
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
        setIsDescriptionOpen(true);
        setPreviewRows(null);
        setPreviewErrors([]);
    }

    /**
     * 説明セクションの開閉を切り替える
     */
    function onToggleDescription() {
        setIsDescriptionOpen(prev => !prev);
    }

    /**
     * ファイル選択イベント
     */
    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0] ?? null;
        setFile(f);
        if (f) {
            setIsDescriptionOpen(false);
            parseCsvForPreview(f);
        }
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
            setIsDescriptionOpen(false);
            parseCsvForPreview(dropped);
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
     * キャンセルボタン押下
     */
    function onCancel() {
        setPreviewRows(null);
    }

    /**
     * CSVをパースしてプレビュー行・バリデーション結果をセットする
     */
    async function parseCsvForPreview(file: File): Promise<void> {

        const text = await file.text();
        const dataRows = parseCsvText(text.replace(/^﻿/, ''));

        const idCounts = new Map<string, number>();
        dataRows.forEach(cols => {
            const id = cols[0]?.trim() ?? '';
            if (id) idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
        });

        const errors: CsvValidationError[] = [];
        const errorRowNumbers = new Set<number>();

        dataRows.forEach((cols, index) => {
            const rowNumber = index + CSV_DATA_START_ROW;
            const id = cols[0]?.trim() ?? '';
            const errorMsg = validateCsvRow(cols, idCounts);
            if (errorMsg) {
                errors.push({ rowNumber, id: id || null, message: errorMsg });
                errorRowNumbers.add(rowNumber);
            }
        });

        const rows: CsvPreviewRow[] = dataRows.map((cols, index) => ({
            id: index + CSV_DATA_START_ROW,
            csvId: cols[0]?.trim() ?? '',
            title: cols[1]?.trim() ?? '',
            categoryName: cols[4]?.trim() ?? '',
            statusName: cols[6]?.trim() ?? '',
            priorityName: cols[8]?.trim() ?? '',
            dueDate: cols[9]?.trim() ?? '',
            createdAt: cols[11]?.trim() ?? '',
            updatedAt: cols[12]?.trim() ?? '',
            isFavorite: cols[10]?.trim() ?? '',
            hasError: errorRowNumbers.has(index + CSV_DATA_START_ROW),
        }));

        setPreviewRows(rows);
        setPreviewErrors(errors);
    }

    /**
     * CSVインポートを実行する
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
        isDescriptionOpen,
        previewRows,
        previewErrors,
        onOpenDialog,
        onCloseDialog,
        onToggleDescription,
        onFileChange,
        onDrop,
        onDragOver,
        onDragLeave,
        onUpload,
        onCancel,
    };
}

export type UseTodoImportReturn = ReturnType<typeof useTodoImport>;
