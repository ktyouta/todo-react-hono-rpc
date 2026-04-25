import { Button } from "@/components";
import { useRef } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiOutlineCheckCircle, HiOutlineDocument, HiOutlineXMark } from "react-icons/hi2";
import { MdOutlineUploadFile } from "react-icons/md";
import type { ImportTodoResponseType } from "../api/import-todo";

type PropsType = {
    isOpen: boolean;
    isLoading: boolean;
    result: ImportTodoResponseType | null;
    file: File | null;
    isDragging: boolean;
    onClose: () => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: () => void;
    onUpload: () => void;
};

export function TodoImportDialog({ isOpen, isLoading, result, file, isDragging, onClose, onFileChange, onDrop, onDragOver, onDragLeave, onUpload }: PropsType) {

    if (!isOpen) {
        return null;
    }

    // ファイル選択inputへの参照（クリックトリガー用）
    const inputRef = useRef<HTMLInputElement>(null);

    const handleContentClick = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-[60vw] min-h-[45vh] max-h-[90vh] flex flex-col shadow-xl mx-4" onClick={handleContentClick}>

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

                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
                    {result ? (
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
                    ) : (
                        <div className="flex flex-col gap-4 flex-1">
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
                                        className={`border-2 border-dashed rounded-lg flex-1 flex flex-col items-center justify-center gap-3 transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
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
                                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-3 h-9 min-w-0 flex-1">
                                            <HiOutlineDocument className="size-4 text-gray-400 shrink-0" />
                                            <p className="text-base text-gray-700 truncate">{file?.name}</p>
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
                    )}
                </div>

                {result && (
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
                )}
            </div>
        </div>
    );
}
