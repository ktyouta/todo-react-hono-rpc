import { Button, Dialog, LoadingOverlay } from "@/components";
import { CATEGORY_ID } from "@/constants/master";
import { CategoryReturnType } from "@/features/api/get-category";
import { PriorityReturnType } from "@/features/api/get-priority";
import { StatusReturnType } from "@/features/api/get-status";
import { HiArrowLeft, HiOutlineStar, HiStar } from "react-icons/hi2";
import { TaskReturnType } from "../api/get-todo";
import { getDueDateStatus } from "../utils/due-date-status";

type PropsType = {
    task: TaskReturnType;
    statusList: StatusReturnType;
    categoryList: CategoryReturnType;
    priorityList: PriorityReturnType;
    isDeleteDialogOpen: boolean;
    onClickBack: () => void;
    onClickEdit: () => void;
    onClickDelete: () => void;
    onCancelDelete: () => void;
    onConfirmDelete: () => void;
    onFavoriteToggle: () => void;
    isLoading: boolean;
}

export function TodoDetailView(props: PropsType) {

    const {
        task,
        isDeleteDialogOpen,
        onClickBack,
        onClickEdit,
        onClickDelete,
        onCancelDelete,
        onConfirmDelete,
        onFavoriteToggle,
        isLoading,
    } = props;

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
                <div className="flex-1" />
                <Button
                    colorType={"blue"}
                    sizeType={"large"}
                    className="px-4 sm:px-10"
                    onClick={onClickEdit}
                >
                    編集
                </Button>
            </div>

            {/* コンテンツ */}
            <div className="w-full pt-7 sm:pt-[50px] text-[15px] flex-1">
                <div className="w-full">
                    <p className="text-base text-gray-400 mb-1 pl-0.5">タイトル</p>
                    <div className="flex items-start gap-2 pr-1">
                        <p className="flex-1 px-0.5 text-2xl font-semibold break-words">
                            {task.title}
                        </p>
                        <button
                            type="button"
                            onClick={onFavoriteToggle}
                            className="shrink-0 mt-1"
                        >
                            {task.isFavorite
                                ? <HiStar className="size-7 text-amber-400" />
                                : <HiOutlineStar className="size-7 text-gray-400" />
                            }
                        </button>
                    </div>
                </div>
                <div className="w-full p-3 sm:p-[20px] border border-[#c0c0c0] rounded mt-3 sm:mt-[20px] bg-white">
                    <div className="mb-3">
                        <p className="text-base text-gray-500">{task.categoryName}内容</p>
                    </div>
                    <p className="w-full min-h-[450px] text-lg whitespace-pre-wrap leading-relaxed text-gray-800 break-words">
                        {task.content}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%] pt-[20px] mt-[20px] border-t border-[#e8e8e8]">
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">カテゴリ</span>
                            <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-lg">
                                {task.categoryName}
                            </span>
                        </div>
                        {task.statusId !== null && (
                            <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                                <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">ステータス</span>
                                <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-lg">
                                    {task.statusName}
                                </span>
                            </div>
                        )}
                    </div>
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
                                    {task.dueDate ? task.dueDate.replaceAll("-", "/") : `なし`}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="mt-[20px] pt-[20px] border-t border-[#e8e8e8] flex flex-col sm:flex-row gap-4 sm:gap-[3%]">
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">登録日</span>
                            <span className="flex-1 px-3 py-2 text-base text-gray-700">
                                {new Date(task.createdAt).toLocaleString('ja-JP')}
                            </span>
                        </div>
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">更新日</span>
                            <span className="flex-1 px-3 py-2 text-base text-gray-700">
                                {new Date(task.updatedAt).toLocaleString('ja-JP')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 削除エリア */}
            <div className="mt-8 sm:mt-[60px] pt-4 sm:pt-[30px] border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 sm:p-5 border border-red-200 rounded bg-red-50">
                    <div>
                        <p className="text-sm font-medium text-red-700">{`${task.categoryName}の削除`}</p>
                        <p className="text-sm text-gray-500 mt-1">{`この${task.categoryName}を削除します。削除後は元に戻せません。`}</p>
                    </div>
                    <Button
                        colorType={"red"}
                        sizeType={"large"}
                        className="shrink-0"
                        onClick={onClickDelete}
                    >
                        {`${task.categoryName}を削除する`}
                    </Button>
                </div>
            </div>

            {/* 削除確認ダイアログ */}
            <Dialog
                isOpen={isDeleteDialogOpen}
                onClose={onCancelDelete}
                title={`${task.categoryName}の削除`}
                size="small"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        {`この${task.categoryName}を削除しますか？`}<br />
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
