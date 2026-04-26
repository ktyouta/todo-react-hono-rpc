import { Button } from "@/components";
import { useRef } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiChevronDown, HiOutlineCheckCircle, HiOutlineDocument, HiOutlineXMark } from "react-icons/hi2";
import { MdOutlineUploadFile } from "react-icons/md";
import type { ImportTodoResponseType } from "../api/import-todo";

type PropsType = {
    isOpen: boolean;
    isLoading: boolean;
    result: ImportTodoResponseType | null;
    file: File | null;
    isDragging: boolean;
    isDescriptionOpen: boolean;
    onClose: () => void;
    onToggleDescription: () => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: () => void;
    onUpload: () => void;
};

type ColumnGuideRow = {
    name: string;
    required: boolean;
    values: string;
};

const COLUMN_GUIDE: ColumnGuideRow[] = [
    { name: 'ID', required: true, values: '更新対象タスクのID（正の整数）' },
    { name: 'タイトル', required: true, values: 'テキスト（200文字以内）' },
    { name: '内容', required: true, values: 'テキスト（2000文字以内）' },
    { name: 'カテゴリID', required: true, values: '1 = タスク　/　2 = メモ' },
    { name: 'ステータスID', required: false, values: '空欄 / 1 = 未着手 / 2 = 進行中 / 3 = 完了　※カテゴリがメモの場合は無効' },
    { name: '優先度ID', required: false, values: '空欄 / 1 = 低 / 2 = 中 / 3 = 高　※カテゴリがメモの場合は無効' },
    { name: '期日', required: false, values: 'YYYY-MM-DD 形式または空欄（例：2025-12-31）' },
    { name: 'お気に入り', required: true, values: '0 = なし　/　1 = あり' },
];

export function TodoImportDialog({ isOpen, isLoading, result, file, isDragging, isDescriptionOpen, onClose, onToggleDescription, onFileChange, onDrop, onDragOver, onDragLeave, onUpload }: PropsType) {

    // ファイル選択inputへの参照（クリックトリガー用）
    const inputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) {
        return null;
    }

    const handleContentClick = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-[60vw] h-[75vh] flex flex-col shadow-xl mx-4" onClick={handleContentClick}>

                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">CSVインポート</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                        <HiOutlineXMark className="size-6" />
                    </button>
                </div>
                {result ? (
                    // アップロード完了後
                    <>
                        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-4">
                                <div className={`flex items-center gap-2 ${result.errors.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    <HiOutlineCheckCircle className="size-6 shrink-0" />
                                    <p className="font-medium text-[17px]">{result.message}（{result.successCount}件更新）</p>
                                </div>
                                {result.errors.length > 0 && (
                                    <div>
                                        <p className="text-base text-gray-500 mb-2">エラー行（{result.errors.length}件）</p>
                                        <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded-md">
                                            <table className="w-full text-[17px]">
                                                <thead className="bg-gray-50 sticky top-0">
                                                    <tr>
                                                        <th className="px-3 py-2 text-left text-gray-600 font-medium w-16">行</th>
                                                        <th className="px-3 py-2 text-left text-gray-600 font-medium w-16">ID</th>
                                                        <th className="px-3 py-2 text-left text-gray-600 font-medium">エラー内容</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {result.errors.map((error, i) => (
                                                        <tr key={i} className="border-t border-gray-100">
                                                            <td className="px-3 py-2 text-gray-700">{error.rowNumber}</td>
                                                            <td className="px-3 py-2 text-gray-700">{error.id ?? "—"}</td>
                                                            <td className="px-3 py-2 text-gray-700">{error.message}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                            <Button
                                colorType="blue"
                                sizeType="medium"
                                onClick={onClose}
                                className="px-4 h-9 py-0 bg-[#fcfdfd] border border-gray-300 text-sm text-gray-600 hover:bg-gray-200"
                            >
                                閉じる
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
                        {/* 説明セクション */}
                        <div className="flex-none border border-gray-200 rounded-md">
                            <button
                                type="button"
                                onClick={onToggleDescription}
                                className="w-full flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md"
                            >
                                <span className="font-medium">インポートについて</span>
                                <HiChevronDown className={`size-4 transition-transform duration-200 ${isDescriptionOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isDescriptionOpen && (
                                <div className="border-t border-gray-200 px-4 pt-3 pb-4 flex flex-col gap-3">
                                    <p className="text-gray-600">
                                        エクスポートしたCSVファイルを編集してインポートすることで、既存のタスクを一括更新できます。1回のインポートで<span className="font-medium">最大200件</span>まで対応しています。
                                    </p>
                                    <div>
                                        <p className="font-medium text-gray-700 mb-2">編集可能なカラム</p>
                                        <div className="border border-gray-200 rounded overflow-hidden">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-3 py-2 text-left text-gray-600 font-medium text-sm border-b border-gray-200 w-28">カラム名</th>
                                                        <th className="px-3 py-2 text-center text-gray-600 font-medium text-sm border-b border-gray-200 w-14">必須</th>
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
                        <div className="flex flex-col gap-4 flex-1 min-h-[150px]">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-500">
                                    <AiOutlineLoading3Quarters className="animate-spin size-8" />
                                    <p>インポート中...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col flex-1 gap-4">
                                    <div
                                        onDrop={onDrop}
                                        onDragOver={onDragOver}
                                        onDragLeave={onDragLeave}
                                        className={`border-2 border-dashed rounded-lg flex-1 flex flex-col items-center justify-center gap-3 transition-colors py-2 ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                                            }`}
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
                                    <div className={`flex-none flex items-center justify-between gap-3 ${!file ? 'invisible' : ''}`}>
                                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-3 h-11 min-w-0 flex-1">
                                            <HiOutlineDocument className="size-4 text-blue-400 shrink-0" />
                                            <p className="text-[17px] text-gray-700 truncate">{file?.name}</p>
                                        </div>
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
                            )}
                        </div>
                    </div>
                )
                }
            </div>
        </div>
    );
}
