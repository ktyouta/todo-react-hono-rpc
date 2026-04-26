import { getCategory } from "@/features/api/get-category";
import { getPriority } from "@/features/api/get-priority";
import { getStatus } from "@/features/api/get-status";
import { useQueryClient } from "@tanstack/react-query";
import Papa from "papaparse";
import { useState } from "react";
import { toast } from "react-toastify";
import { importTodo, ImportTodoResponseType } from "../api/import-todo";
import { todoKeys } from "../api/query-key";

// カラム数
const CSV_COLUMN_COUNT = 13;
// 読み込み開始行
const CSV_DATA_START_ROW = 2;
// 有効カテゴリ値
const VALID_CATEGORY_IDS = [1, 2];
// 有効ステータス値
const VALID_STATUS_IDS = [1, 2, 3];
// 有効優先度値
const VALID_PRIORITY_IDS = [1, 2, 3];

// カラムインデックス
const COL = {
    ID: 0,
    TITLE: 1,
    CONTENT: 2,
    CATEGORY_ID: 3,
    STATUS_ID: 5,
    PRIORITY_ID: 7,
    DUE_DATE: 9,
    IS_FAVORITE: 10,
    CREATED_AT: 11,
    UPDATED_AT: 12,
} as const;

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
function validateCsvRow(cols: string[], idCounts: Map<string, number>) {

    const errorMsgList: string[] = [];

    if (cols.length < CSV_COLUMN_COUNT) {
        errorMsgList.push(`カラム数が不正です`);
    }

    const id = cols[0]?.trim() ?? '';
    if (!id) {
        errorMsgList.push(`IDが入力されていません`);
    }

    const idNum = Number(id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
        errorMsgList.push(`IDが不正です（正の整数を入力してください）`);
    }

    if ((idCounts.get(id) ?? 0) > 1) {
        errorMsgList.push(`IDが重複しています`);
    }

    const title = cols[COL.ID]?.trim() ?? '';
    if (!title) {
        errorMsgList.push(`タイトルを入力してください`);
    }

    if (title.length > 200) {
        errorMsgList.push(`タイトルは200文字以内で入力してください`);
    }

    const content = cols[COL.CONTENT]?.trim() ?? '';
    if (!content) {
        errorMsgList.push(`内容を入力してください`);
    }

    if (content.length > 2000) {
        errorMsgList.push(`内容は2000文字以内で入力してください`);
    }

    const categoryStr = cols[COL.CATEGORY_ID]?.trim() ?? '';
    const categoryId = categoryStr ? Number(categoryStr) : NaN;
    if (!Number.isInteger(categoryId) || !VALID_CATEGORY_IDS.includes(categoryId)) {
        errorMsgList.push(`カテゴリIDが不正です（使用可能な値: ${VALID_CATEGORY_IDS.join(', ')}）`);
    }

    const statusStr = cols[COL.STATUS_ID]?.trim() ?? '';
    if (statusStr) {
        const statusId = Number(statusStr);
        if (!Number.isInteger(statusId) || !VALID_STATUS_IDS.includes(statusId)) {
            errorMsgList.push(`ステータスIDが不正です（使用可能な値: 空欄, ${VALID_STATUS_IDS.join(', ')}）`);
        }
    }

    const priorityStr = cols[COL.PRIORITY_ID]?.trim() ?? '';
    if (priorityStr) {
        const priorityId = Number(priorityStr);
        if (!Number.isInteger(priorityId) || !VALID_PRIORITY_IDS.includes(priorityId)) {
            errorMsgList.push(`優先度IDが不正です（使用可能な値: 空欄, ${VALID_PRIORITY_IDS.join(', ')}）`);
        }
    }

    const dueDate = cols[COL.DUE_DATE]?.trim() ?? '';
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
        errorMsgList.push(`DD形式で入力してください`);
    }

    const favorite = cols[COL.IS_FAVORITE]?.trim() ?? '';
    if (favorite !== '0' && favorite !== '1') {
        errorMsgList.push(`お気に入りは0または1で入力してください`);
    }

    return errorMsgList;
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
    // カテゴリリスト
    const { data: category } = getCategory();
    // ステータスリスト
    const { data: status } = getStatus();
    // 優先度リスト
    const { data: priority } = getPriority();
    // タスク一覧再取得用
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

        const csvText = await file.text();
        const dataRows = parseCsvText(csvText);

        const idCounts = new Map<string, number>();
        dataRows.forEach(cols => {
            const id = cols[COL.ID]?.trim() ?? '';
            if (id) {
                idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
            }
        });

        const errors: CsvValidationError[] = [];
        const errorRowNumbers = new Set<number>();

        dataRows.forEach((cols, index) => {
            const rowNumber = index + CSV_DATA_START_ROW;
            const errorMsgList = validateCsvRow(cols, idCounts);
            if (errorMsgList.length > 0) {
                errorMsgList.forEach((e) => {
                    errors.push({ rowNumber, id: cols[COL.ID]?.trim() || null, message: e });
                })
                errorRowNumbers.add(rowNumber);
            }
        });

        // カテゴリ
        const categoryMap = new Map<number, string>();
        category.data.forEach((e) => {
            categoryMap.set(e.id, e.name);
        });

        // ステータス
        const statusMap = new Map<number, string>();
        status.data.forEach((e) => {
            statusMap.set(e.id, e.name);
        });

        // 優先度
        const priorityMap = new Map<number, string>();
        priority.data.forEach((e) => {
            priorityMap.set(e.id, e.name);
        });

        const rows: CsvPreviewRow[] = dataRows.map((cols, index) => {

            const categoryId = cols[COL.CATEGORY_ID]?.trim() ?? '';
            const categoryName = categoryMap.get(Number(categoryId)) ?? `入力値が不正です`;
            const statusId = cols[COL.STATUS_ID]?.trim() ?? '';
            const statusName = statusId ? statusMap.get(Number(statusId)) ?? `入力値が不正です` : ``;
            const priorityId = cols[COL.PRIORITY_ID]?.trim() ?? '';
            const priorityName = priorityId ? priorityMap.get(Number(priorityId)) ?? `入力値が不正です` : ``;

            return {
                id: index + CSV_DATA_START_ROW,
                csvId: cols[COL.ID]?.trim() ?? '',
                title: cols[COL.TITLE]?.trim() ?? '',
                categoryName,
                statusName,
                priorityName,
                dueDate: cols[COL.DUE_DATE]?.trim() ?? '',
                createdAt: cols[COL.CREATED_AT]?.trim() ?? '',
                updatedAt: cols[COL.UPDATED_AT]?.trim() ?? '',
                isFavorite: cols[COL.IS_FAVORITE]?.trim() ?? '',
                hasError: errorRowNumbers.has(index + CSV_DATA_START_ROW),
            }
        });

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
