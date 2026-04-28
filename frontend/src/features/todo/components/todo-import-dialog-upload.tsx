import { Button, Table } from "@/components";
import { TableProps } from "@/components/ui/table/table";
import { useMemo, useRef } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiChevronDown, HiOutlineCheckCircle, HiOutlineDocument, HiOutlineStar, HiStar } from "react-icons/hi2";
import { MdOutlineUploadFile } from "react-icons/md";
import { COL } from "../constants/csv-import";
import type { ColumnGuideRow, CsvPreviewRow, CsvValidationError } from "../hooks/use-todo-import";

type PropsType = {
    isLoading: boolean;
    file: File | null;
    isDragging: boolean;
    isDescriptionOpen: boolean;
    previewRows: CsvPreviewRow[] | null;
    previewErrors: CsvValidationError[];
    columnGuide: ColumnGuideRow[];
    onToggleDescription: () => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: () => void;
    onUpload: () => void;
    onCancel: () => void;
};

/**
 * バリデーションエラーのあるセルを「行番号 → エラー列インデックスのSet」で管理するMapを作成
 * @param previewErrors 
 * @returns 
 */
function buildErrorCellMap(previewErrors: CsvValidationError[]): Map<number, Set<number>> {
    const map = new Map<number, Set<number>>();
    previewErrors.forEach(e => {
        if (e.col === undefined) {
            return;
        }
        if (!map.has(e.rowNumber)) {
            map.set(e.rowNumber, new Set());
        }
        const rowMap = map.get(e.rowNumber);
        if (rowMap) {
            rowMap.add(e.col);
        }
    });
    return map;
}

/**
 * バリデーションエラー表示用セル
 */
function InvalidCell() {
    return <span className="text-red-600">入力が不正です</span>;
}

/**
 * プレビューテーブルのカラム定義を作成
 * @param errorCellMap 
 * @returns 
 */
function buildPreviewColumns(errorCellMap: Map<number, Set<number>>): TableProps<CsvPreviewRow>['columns'] {
    function isError(rowNumber: number, col: number): boolean {
        return errorCellMap.get(rowNumber)?.has(col) ?? false;
    }
    return [
        { title: '行', field: 'id', className: 'w-[5%] whitespace-nowrap pl-6' },
        {
            title: 'ID', field: 'csvId', className: 'w-[6%] whitespace-nowrap',
            Cell: ({ entry }) => isError(entry.id, COL.ID) ? <InvalidCell /> : <span>{entry.csvId}</span>
        },
        {
            title: 'タイトル', field: 'title', className: 'max-w-0',
            Cell: ({ entry }) => isError(entry.id, COL.TITLE)
                ? <InvalidCell />
                : <span className="block truncate">{entry.title}</span>
        },
        {
            title: 'カテゴリ', field: 'categoryName', className: 'w-[10%] whitespace-nowrap',
            Cell: ({ entry }) => isError(entry.id, COL.CATEGORY_ID) ? <InvalidCell /> : <span>{entry.categoryName}</span>
        },
        {
            title: 'ステータス', field: 'statusName', className: 'w-[10%] whitespace-nowrap',
            Cell: ({ entry }) => isError(entry.id, COL.STATUS_ID) ? <InvalidCell /> : <span>{entry.statusName}</span>
        },
        {
            title: '優先度', field: 'priorityName', className: 'w-[10%] whitespace-nowrap',
            Cell: ({ entry }) => isError(entry.id, COL.PRIORITY_ID) ? <InvalidCell /> : <span>{entry.priorityName}</span>
        },
        {
            title: '期日', field: 'dueDate', className: 'w-[9%] whitespace-nowrap',
            Cell: ({ entry }) => isError(entry.id, COL.DUE_DATE)
                ? <InvalidCell />
                : <span>{entry.dueDate || '—'}</span>
        },
        { title: '登録日', field: 'createdAt', className: 'w-[9%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.createdAt.slice(0, 10)}</span> },
        { title: '更新日', field: 'updatedAt', className: 'w-[9%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.updatedAt.slice(0, 10)}</span> },
        {
            title: 'お気に入り', field: 'isFavorite', className: 'w-[9%] whitespace-nowrap text-center',
            Cell: ({ entry }) => isError(entry.id, COL.IS_FAVORITE)
                ? <InvalidCell />
                : (entry.isFavorite === '1'
                    ? <HiStar className="size-5 text-amber-400 mx-auto" />
                    : <HiOutlineStar className="size-5 text-gray-400 mx-auto" />)
        },
    ];
}

export function TodoImportDialogUpload({ isLoading, file, isDragging, isDescriptionOpen, previewRows, previewErrors, columnGuide, onToggleDescription, onFileChange, onDrop, onDragOver, onDragLeave, onUpload, onCancel }: PropsType) {

    // ファイル選択inputへの参照
    const inputRef = useRef<HTMLInputElement>(null);
    // エラーセルMap（行番号 → エラー列インデックスのSet）
    const errorCellMap = useMemo(() => buildErrorCellMap(previewErrors), [previewErrors]);
    // プレビューテーブルのカラム定義
    const previewColumns = useMemo(() => buildPreviewColumns(errorCellMap), [errorCellMap]);

    return (
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
            {/* 説明セクション */}
            <div className="flex-none border border-gray-200 rounded-md">
                <button
                    type="button"
                    onClick={onToggleDescription}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md"
                >
                    <span className="font-medium">インポートについて</span>
                    <HiChevronDown className={`size-4 transition-transform duration-200 ${isDescriptionOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDescriptionOpen && (
                    <div className="border-t border-gray-200 px-4 pt-3 pb-4 flex flex-col gap-5">
                        <p className="text-gray-600">
                            エクスポートしたCSVファイルを編集してインポートすることで、既存のタスクを一括更新できます。1回のインポートで<span className="font-medium">最大200件</span>まで対応しています。
                        </p>
                        <div className="flex flex-col">
                            <p className="font-medium text-gray-700 mb-2">編集可能なカラム</p>
                            <div className="border border-gray-200 rounded overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-gray-600 font-medium text-sm border-b border-gray-200 w-28">カラム名</th>
                                            <th className="px-3 py-2 text-center text-gray-600 font-medium text-sm border-b border-gray-200 w-16">必須</th>
                                            <th className="px-3 py-2 text-left text-gray-600 font-medium text-sm border-b border-gray-200">設定できる値</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {columnGuide.map((row, i) => (
                                            <tr key={row.name} className={i < columnGuide.length - 1 ? 'border-b border-gray-100' : ''}>
                                                <td className="px-3 py-1.5 font-medium text-gray-700">{row.name}</td>
                                                <td className="px-3 py-1.5 text-center text-gray-500">{row.required ? '○' : '—'}</td>
                                                <td className="px-3 py-1.5 text-gray-600">{row.values}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700 mb-1">変更禁止のカラム</p>
                            <p className="text-gray-500">以下のカラムは参照用のため、値を変更しても無視されます。</p>
                            <p className="text-gray-500">カテゴリ・ステータス・優先度（名前列）、作成日時、更新日時</p>
                        </div>
                    </div>
                )}
            </div>

            {/* メインエリア */}
            <div className="flex flex-col gap-4 flex-1 min-h-[150px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-500">
                        <AiOutlineLoading3Quarters className="animate-spin size-8" />
                        <p>インポート中...</p>
                    </div>
                ) : previewRows !== null ? (
                    // ファイル選択後：プレビューテーブル
                    <div className="flex flex-col flex-1 gap-4">
                        <div className="flex-1 border border-gray-200 rounded-md overflow-auto">
                            <Table
                                data={previewRows}
                                columns={previewColumns}
                                className="text-[17px] table-fixed
                                                [&_thead]:bg-gray-50/90
                                                [&_thead_tr]:border-b
                                                [&_thead_tr]:border-gray-400/60"
                                rowClassName={(row) => `h-[50px] border-gray-300/80 ${row.hasError ? 'bg-red-50 hover:bg-red-50' : 'hover:bg-[#EFEFEF]'}`}
                            />
                        </div>

                        {/* バリデーション結果 */}
                        {previewErrors.length === 0 ? (
                            <div className="flex items-center gap-1.5 text-green-600 text-sm">
                                <HiOutlineCheckCircle className="size-4 shrink-0" />
                                <p>バリデーションエラーなし</p>
                            </div>
                        ) : (
                            <div className="flex-none">
                                <p className="text-base text-red-600 mb-1.5 font-medium">バリデーションエラー（{previewErrors.length}件）</p>
                                <div className="max-h-[380px] overflow-y-auto border border-red-100 rounded-md bg-red-50">
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 bg-red-100">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-red-700 font-medium w-14 border-b border-red-200">行</th>
                                                <th className="px-3 py-2 text-left text-red-700 font-medium w-14 border-b border-red-200">ID</th>
                                                <th className="px-3 py-2 text-left text-red-700 font-medium border-b border-red-200">エラー内容</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewErrors.map((error, i) => (
                                                <tr key={i} className="border-t border-red-100">
                                                    <td className="px-3 py-2 text-red-700">{error.rowNumber}</td>
                                                    <td className="px-3 py-2 text-red-700">{error.id ?? '—'}</td>
                                                    <td className="px-3 py-2 text-red-700">{error.message}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ファイル名 + アップロードボタン */}
                        <div className="flex-none flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-3 h-11 min-w-0 flex-1">
                                <HiOutlineDocument className="size-4 text-blue-400 shrink-0" />
                                <p className="text-[17px] text-gray-700 truncate">{file?.name}</p>
                            </div>
                            <Button
                                colorType="blue"
                                sizeType="medium"
                                onClick={onCancel}
                                className="px-4 h-9 py-0 font-medium bg-[#fcfdfd] border border-gray-300 text-sm hover:bg-gray-200 text-gray-600 whitespace-nowrap shrink-0"
                            >
                                キャンセル
                            </Button>
                            <Button
                                colorType="blue"
                                sizeType="medium"
                                onClick={onUpload}
                                disabled={previewErrors.length > 0}
                                className="px-4 h-9 py-0 font-medium whitespace-nowrap shrink-0 disabled:opacity-80 disabled:hover:bg-blue-500"
                            >
                                アップロード
                            </Button>
                        </div>
                    </div>
                ) : (
                    // ファイル未選択：ドロップゾーン表示
                    <div className="flex flex-col flex-1 gap-4">
                        <div
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            className={`border-2 border-dashed rounded-lg flex-1 flex flex-col items-center justify-center gap-3 transition-colors py-2 ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
                        >
                            <MdOutlineUploadFile className="size-12 text-gray-400" />
                            <p className="text-base text-gray-500">ここにCSVファイルをドロップ</p>
                            <Button
                                colorType="blue"
                                sizeType="medium"
                                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                                className="px-4 h-9 py-0 bg-[#fcfdfd] border border-gray-300 text-base text-gray-600 hover:bg-gray-200"
                            >
                                ファイルを選択
                            </Button>
                            <input
                                ref={inputRef}
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={onFileChange}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
