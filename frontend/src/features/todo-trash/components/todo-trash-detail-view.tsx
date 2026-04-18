import { Button, Dialog, LoadingOverlay } from "@/components";
import { CATEGORY_ID } from "@/constants/master";
import { getFormatDatetime } from "@/utils/date-util";
import { getDueDateStatus } from "@/utils/due-date-status";
import { HiArrowLeft } from "react-icons/hi2";
import { TodoTrashReturnType } from "../api/get-todo-trash";
import { TodoTrashSubtaskSectionContainer } from "./todo-trash-subtask-section-container";

type PropsType = {
    task: TodoTrashReturnType;
    onClickBack: () => void;
    isRestoreDialogOpen: boolean;
    onClickRestore: () => void;
    onCancelRestore: () => void;
    onConfirmRestore: () => void;
    isDeleteDialogOpen: boolean;
    onClickDelete: () => void;
    onCancelDelete: () => void;
    onConfirmDelete: () => void;
    isLoading: boolean;
};

export function TodoTrashDetailView(props: PropsType) {

    const {
        task,
        onClickBack,
        isRestoreDialogOpen,
        onClickRestore,
        onCancelRestore,
        onConfirmRestore,
        isDeleteDialogOpen,
        onClickDelete,
        onCancelDelete,
        onConfirmDelete,
        isLoading,
    } = props;

    // 期限ステータス
    const dueDateStatus = getDueDateStatus(task.dueDate);

    return (
        <div className="w-full min-h-full flex flex-col pb-4">
            {/* 一覧に戻る */}
            <div className="mb-4">
                <button
                    type="button"
                    onClick={onClickBack}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                    <HiArrowLeft />
                    <span>一覧に戻る</span>
                </button>
            </div>

            {/* ヘッダー */}
            <div className="flex items-center pr-[10px]">
                <span className="font-bold text-[18px] sm:text-[22px]">
                    タスク詳細
                </span>
            </div>

            {/* コンテンツ */}
            <div className="w-full pt-7 sm:pt-[35px] text-[15px] flex-1">
                <div className="w-full">
                    <p className="text-base text-gray-400 mb-1 pl-0.5">タイトル</p>
                    <p className="w-full px-0.5 text-2xl font-semibold break-words">
                        {task.title}
                    </p>
                </div>
                <div className="w-full p-3 sm:p-[20px] border border-[#c0c0c0] rounded mt-3 sm:mt-[20px] bg-white">
                    <div className="mb-3">
                        {task.categoryId === CATEGORY_ID.TASK && <p className="text-base text-gray-500">タスク内容</p>}
                        {task.categoryId === CATEGORY_ID.MEMO && <p className="text-base text-gray-500">メモ内容</p>}
                    </div>
                    <p className="w-full min-h-[450px] text-lg whitespace-pre-wrap leading-relaxed text-gray-800 break-words">
                        {task.content}
                    </p>
                    {/* サブタスクの場合：親タスク表示 */}
                    {task.parentId !== null && (
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%] pt-[20px] mt-[20px] border-t border-[#e8e8e8]">
                            <div className="flex flex-1 items-start gap-2">
                                <span className="whitespace-nowrap w-[5em] text-gray-500 text-base pt-2">親タスク</span>
                                <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-lg break-words">
                                    {task.parentTitle}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%] pt-[20px] mt-[20px] border-t border-[#e8e8e8]">
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">カテゴリ</span>
                            <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-lg">
                                {task.categoryName}
                            </span>
                        </div>
                    </div>
                    {task.statusId !== null && (
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%] pt-[20px] mt-[20px] border-t border-[#e8e8e8]">
                            <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                                <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">ステータス</span>
                                <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-lg">
                                    {task.statusName}
                                </span>
                            </div>
                        </div>
                    )}
                    {task.categoryId !== CATEGORY_ID.MEMO && (
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%] pt-[20px] mt-[20px] border-t border-[#e8e8e8]">
                            <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                                <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">優先度</span>
                                <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-lg">
                                    {task.priorityName}
                                </span>
                            </div>
                            <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                                <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">期限日</span>
                                <span className={`flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-lg ${dueDateStatus === 'overdue' ? 'text-red-600' : dueDateStatus === 'warning' ? 'text-amber-500' : ''}`}>
                                    {task.dueDate ? task.dueDate : `なし`}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="mt-[20px] pt-[20px] border-t border-[#e8e8e8] flex flex-col sm:flex-row gap-4 sm:gap-[3%]">
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">登録日</span>
                            <span className="flex-1 px-3 py-2 text-base text-gray-700">
                                {getFormatDatetime(new Date(task.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                            </span>
                        </div>
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">更新日</span>
                            <span className="flex-1 px-3 py-2 text-base text-gray-700">
                                {getFormatDatetime(new Date(task.updatedAt), 'yyyy-MM-dd HH:mm:ss')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 親タスクの場合：サブタスクセクション */}
            {task.parentId === null && (
                <TodoTrashSubtaskSectionContainer />
            )}

            {/* 復元エリア・物理削除エリア */}
            <div className="mt-8 sm:mt-[60px] pt-4 sm:pt-[30px] border-t border-gray-200 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 sm:p-5 border border-blue-200 rounded bg-blue-50">
                    <div>
                        <p className="text-sm font-medium text-blue-700">タスクを復元する</p>
                        <p className="text-sm text-gray-500 mt-1">このタスクを復元します。復元後はタスク管理画面から参照できます。</p>
                    </div>
                    <Button
                        colorType={"blue"}
                        sizeType={"large"}
                        className="shrink-0"
                        onClick={onClickRestore}
                    >
                        復元する
                    </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 sm:p-5 border border-red-200 rounded bg-red-50">
                    <div>
                        <p className="text-sm font-medium text-red-700">完全に削除する</p>
                        <p className="text-sm text-gray-500 mt-1">このタスクを完全に削除します。削除後は元に戻せません。</p>
                    </div>
                    <Button
                        colorType={"red"}
                        sizeType={"large"}
                        className="shrink-0"
                        onClick={onClickDelete}
                    >
                        完全に削除する
                    </Button>
                </div>
            </div>

            {/* 復元確認ダイアログ */}
            <Dialog
                isOpen={isRestoreDialogOpen}
                onClose={onCancelRestore}
                title="タスクの復元"
                size="small"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        このタスクを復元しますか？<br />
                        復元後はタスク管理画面から参照できます。
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            colorType={"blue"}
                            sizeType={"medium"}
                            onClick={onCancelRestore}
                        >
                            キャンセル
                        </Button>
                        <Button
                            colorType={"blue"}
                            sizeType={"medium"}
                            onClick={onConfirmRestore}
                        >
                            復元する
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* 物理削除確認ダイアログ */}
            <Dialog
                isOpen={isDeleteDialogOpen}
                onClose={onCancelDelete}
                title="タスクの完全削除"
                size="small"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        このタスクを完全に削除しますか？<br />
                        この操作は取り消せません。
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            colorType={"blue"}
                            sizeType={"medium"}
                            onClick={onCancelDelete}
                        >
                            キャンセル
                        </Button>
                        <Button
                            colorType={"red"}
                            sizeType={"medium"}
                            onClick={onConfirmDelete}
                        >
                            削除する
                        </Button>
                    </div>
                </div>
            </Dialog>

            {isLoading && <LoadingOverlay />}
        </div>
    );
}
