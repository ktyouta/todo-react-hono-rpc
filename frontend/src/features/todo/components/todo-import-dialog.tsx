import { HiOutlineXMark } from "react-icons/hi2";
import type { ImportTodoResponseType } from "../api/import-todo";
import type { ColumnGuideRow, CsvPreviewRow, CsvValidationError } from "../hooks/use-todo-import";
import { TodoImportDialogResult } from "./todo-import-dialog-result";
import { TodoImportDialogUpload } from "./todo-import-dialog-upload";

type PropsType = {
    isOpen: boolean;
    isLoading: boolean;
    result: ImportTodoResponseType | null;
    file: File | null;
    isDragging: boolean;
    isDescriptionOpen: boolean;
    previewRows: CsvPreviewRow[] | null;
    previewErrors: CsvValidationError[];
    columnGuide: ColumnGuideRow[];
    onClose: () => void;
    onToggleDescription: () => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: () => void;
    onUpload: () => void;
    onCancel: () => void;
};

export function TodoImportDialog({ isOpen, isLoading, result, file, isDragging, isDescriptionOpen, previewRows, previewErrors, columnGuide, onClose, onToggleDescription, onFileChange, onDrop, onDragOver, onDragLeave, onUpload, onCancel }: PropsType) {

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-[90vw] h-[95vh] flex flex-col shadow-xl mx-4" onClick={(event: React.MouseEvent) => { event.stopPropagation() }}>

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
                    <TodoImportDialogResult
                        result={result}
                        onClose={onClose}
                    />) : (
                    // アップロード前
                    <TodoImportDialogUpload
                        isLoading={isLoading}
                        file={file}
                        isDragging={isDragging}
                        isDescriptionOpen={isDescriptionOpen}
                        previewRows={previewRows}
                        previewErrors={previewErrors}
                        columnGuide={columnGuide}
                        onToggleDescription={onToggleDescription}
                        onFileChange={onFileChange}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onUpload={onUpload}
                        onCancel={onCancel}
                    />)
                }
            </div>
        </div>
    );
}
