import { Button, Table } from "@/components";
import { TableProps } from "@/components/ui/table/table";
import { useRef } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiChevronDown, HiOutlineCheckCircle, HiOutlineDocument, HiOutlineStar, HiStar } from "react-icons/hi2";
import { MdOutlineUploadFile } from "react-icons/md";
import type { CsvPreviewRow, CsvValidationError } from "../hooks/use-todo-import";

type PropsType = {
    isOpen: boolean;
    isLoading: boolean;
    file: File | null;
    isDragging: boolean;
    isDescriptionOpen: boolean;
    previewRows: CsvPreviewRow[] | null;
    previewErrors: CsvValidationError[];
    onToggleDescription: () => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: () => void;
    onUpload: () => void;
    onCancel: () => void;
};

type ColumnGuideRow = {
    name: string;
    required: boolean;
    values: string;
};

// インポート説明用
const COLUMN_GUIDE: ColumnGuideRow[] = [
    { name: 'ID', required: true, values: '更新対象タスクのID（変更しないでください）' },
    { name: 'タイトル', required: true, values: 'テキスト（200文字以内）' },
    { name: '内容', required: true, values: 'テキスト（2000文字以内）' },
    { name: 'カテゴリID', required: true, values: '1 = タスク　/　2 = メモ' },
    { name: 'ステータスID', required: false, values: '空欄 / 1 = 未着手 / 2 = 進行中 / 3 = 完了　※カテゴリがメモの場合は無効' },
    { name: '優先度ID', required: false, values: '空欄 / 1 = 低 / 2 = 中 / 3 = 高　※カテゴリがメモの場合は無効' },
    { name: '期日', required: false, values: 'YYYY-MM-DD 形式または空欄（例：2025-12-31）' },
    { name: 'お気に入り', required: true, values: '0 = なし　/　1 = あり' },
];

// CSVプレビューテーブルのカラム定義
const previewColumns: TableProps<CsvPreviewRow>['columns'] = [
    { title: '行', field: 'id', className: 'w-[5%] whitespace-nowrap pl-4' },
    { title: 'ID', field: 'csvId', className: 'w-[6%] whitespace-nowrap' },
    { title: 'タイトル', field: 'title', className: 'max-w-0', Cell: ({ entry }) => <span className="block truncate">{entry.title}</span> },
    { title: 'カテゴリ', field: 'categoryName', className: 'w-[10%] whitespace-nowrap' },
    { title: 'ステータス', field: 'statusName', className: 'w-[10%] whitespace-nowrap' },
    { title: '優先度', field: 'priorityName', className: 'w-[8%] whitespace-nowrap' },
    { title: '期日', field: 'dueDate', className: 'w-[9%] whitespace-nowrap', Cell: ({ entry }) => <span>{entry.dueDate || '—'}</span> },
    { title: '登録日', field: 'createdAt', className: 'w-[9%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.createdAt.slice(0, 10)}</span> },
    { title: '更新日', field: 'updatedAt', className: 'w-[9%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.updatedAt.slice(0, 10)}</span> },
    {
        title: '', field: 'isFavorite', className: 'w-[4%] whitespace-nowrap text-center', Cell: ({ entry }) => (
            entry.isFavorite === '1'
                ? <HiStar className="size-5 text-amber-400 mx-auto" />
                : <HiOutlineStar className="size-5 text-gray-400 mx-auto" />
        )
    },
];

export function TodoImportDialogUpload({ isLoading, file, isDragging, isDescriptionOpen, previewRows, previewErrors, onToggleDescription, onFileChange, onDrop, onDragOver, onDragLeave, onUpload, onCancel }: PropsType) {

    // ファイル選択inputへの参照
    const inputRef = useRef<HTMLInputElement>(null);

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
                                        {COLUMN_GUIDE.map((row, i) => (
                                            <tr key={row.name} className={i < COLUMN_GUIDE.length - 1 ? 'border-b border-gray-100' : ''}>
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
                                <div className="max-h-[120px] overflow-y-auto border border-red-100 rounded-md bg-red-50">
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 bg-red-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-red-700 font-medium w-14 border-b border-red-100">行</th>
                                                <th className="px-3 py-2 text-left text-red-700 font-medium w-14 border-b border-red-100">ID</th>
                                                <th className="px-3 py-2 text-left text-red-700 font-medium border-b border-red-100">エラー内容</th>
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
                                className="px-4 h-9 py-0 font-medium whitespace-nowrap shrink-0"
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
