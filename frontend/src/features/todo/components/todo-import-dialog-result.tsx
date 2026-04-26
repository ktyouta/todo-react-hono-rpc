import { Button } from "@/components";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import type { ImportTodoResponseType } from "../api/import-todo";

type PropsType = {
    result: ImportTodoResponseType;
    onClose: () => void;
};

export function TodoImportDialogResult({ result, onClose }: PropsType) {

    return (
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
    );
}
