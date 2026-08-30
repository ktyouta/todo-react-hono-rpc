import { Breadcrumb, Button, CopyButton, Dialog, LoadingOverlay } from "@/components";
import { paths } from "@/config/paths";
import { CATEGORY_ID, STATUS_ID } from "@/constants/master";
import { CategoryReturnType } from "@/features/api/get-category";
import { PriorityReturnType } from "@/features/api/get-priority";
import { StatusReturnType } from "@/features/api/get-status";
import { getFormatDatetime } from "@/utils/date-util";
import { getDueDateStatus } from "@/utils/due-date-status";
import { HiArrowLeft, HiOutlineStar, HiStar } from "react-icons/hi2";
import { TbBinaryTree } from "react-icons/tb";
import { TaskDataType } from "../api/get-todo";
import { SubtaskSectionContainer } from "./subtask-section-container";

type PropsType = {
    task: TaskDataType;
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
    onClickTree: () => void;
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
        onClickTree,
        isLoading,
    } = props;

    const dueDateStatus = task.statusId === STATUS_ID.COMPLETED ? 'normal' : getDueDateStatus(task.dueDate);

    return (
        <div className="w-full min-h-full flex flex-col pb-4">
            {/* ナビゲーション */}
            <div className="flex items-center mb-5">
                <div className="flex-1 min-w-0">
                    {task.parentId ? (
                        <Breadcrumb
                            items={[
                                { label: "タスク一覧", href: paths.todo.path },
                                ...task.ancestors.map((a) => ({
                                    label: a.title,
                                    href: paths.todoDetail.getHref(a.id),
                                })),
                            ]}
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={onClickBack}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <HiArrowLeft />
                            <span>一覧に戻る</span>
                        </button>
                    )}
                </div>
                {/* SP: ツリーを見る（アイコンのみ）＋編集ボタン */}
                <div className="shrink-0 flex items-center gap-2 sm:hidden ml-2">
                    <button
                        type="button"
                        onClick={onClickTree}
                        className="flex items-center justify-center h-11 w-11 bg-[#fcfdfd] border border-gray-300 text-sm text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 rounded"
                    >
                        <TbBinaryTree className="size-4" />
                    </button>
                    <Button
                        colorType={"blue"}
                        sizeType={"large"}
                        className="px-4"
                        onClick={onClickEdit}
                    >
                        編集
                    </Button>
                </div>
            </div>

            {/* ヘッダー */}
            <div className="flex items-center pr-[10px]">
                <span className="text-[21px] sm:text-2xl font-semibold dark:text-gray-100 break-words min-w-0">
                    {task.title}
                </span>
                <div className="flex-1" />
                {!task.parentId &&
                    <button
                        type="button"
                        onClick={onFavoriteToggle}
                        className="sm:mr-5"
                    >
                        {task.isFavorite
                            ? <HiStar className="size-7 text-amber-400 dark:text-amber-500" />
                            : <HiOutlineStar className="size-7 text-gray-400 dark:text-gray-500" />
                        }
                    </button>
                }
                {/* PC: ツリーを見る（アイコン+テキスト） */}
                <button
                    type="button"
                    onClick={onClickTree}
                    className="hidden sm:flex items-center gap-1 text-base text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 mr-6"
                >
                    <TbBinaryTree className="size-4" />
                    <span>タスクツリーを表示</span>
                </button>
                <Button
                    colorType={"blue"}
                    sizeType={"large"}
                    className="hidden sm:block px-10"
                    onClick={onClickEdit}
                >
                    編集
                </Button>
            </div>

            {/* コンテンツ */}
            <div className="w-full pt-7 sm:pt-[1px] text-[15px] flex-1">
                <div className="w-full p-3 sm:p-[20px] border border-[#c0c0c0] dark:border-gray-600 rounded mt-3 sm:mt-[20px] bg-white dark:bg-gray-800">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-base text-gray-500 dark:text-gray-400">{task.categoryName}内容</p>
                        <CopyButton text={task.content ?? ""} />
                    </div>
                    <p className={`w-full min-h-[450px] text-base sm:text-lg whitespace-pre-wrap leading-relaxed break-words ${task.content ? "text-gray-800 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}>
                        {task.content ?? "なし"}
                    </p>
                    {task.parentId !== null && (
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%] pt-[20px] mt-[20px] border-t border-[#e8e8e8] dark:border-gray-700">
                            <div className="flex flex-1 items-center gap-2">
                                <span className="whitespace-nowrap w-[5em] text-gray-500 dark:text-gray-400 text-base">親タスク</span>
                                <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 rounded text-lg break-words">
                                    {task.parentTitle}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%] pt-[20px] mt-[20px] border-t border-[#e8e8e8] dark:border-gray-700">
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap w-[5em] text-gray-500 dark:text-gray-400 text-base">カテゴリ</span>
                            <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 rounded text-lg">
                                {task.categoryName}
                            </span>
                        </div>
                        {task.statusId !== null && (
                            <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                                <span className="whitespace-nowrap w-[5em] text-gray-500 dark:text-gray-400 text-base">ステータス</span>
                                <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 rounded text-lg">
                                    {task.statusName}
                                </span>
                            </div>
                        )}
                    </div>
                    {task.categoryId !== CATEGORY_ID.MEMO && (
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%] pt-[20px] mt-[20px] border-t border-[#e8e8e8] dark:border-gray-700">
                            <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                                <span className="whitespace-nowrap w-[5em] text-gray-500 dark:text-gray-400 text-base">優先度</span>
                                <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 rounded text-lg">
                                    {task.priorityName}
                                </span>
                            </div>
                            <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                                <span className="whitespace-nowrap w-[5em] text-gray-500 dark:text-gray-400 text-base">期限日</span>
                                <span className={`flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] dark:bg-gray-700 dark:border-gray-600 rounded text-lg ${dueDateStatus === 'overdue' ? 'text-red-600 dark:text-red-400' : dueDateStatus === 'warning' ? 'text-amber-500 dark:text-amber-400' : 'dark:text-gray-100'}`}>
                                    {task.dueDate ? task.dueDate : `なし`}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="mt-[20px] pt-[20px] border-t border-[#e8e8e8] dark:border-gray-700 flex flex-col sm:flex-row gap-4 sm:gap-[3%]">
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap w-[5em] text-gray-500 dark:text-gray-400 text-base">登録日</span>
                            <span className="flex-1 px-3 py-2 text-base text-gray-700 dark:text-gray-300">
                                {getFormatDatetime(new Date(task.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                            </span>
                        </div>
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap w-[5em] text-gray-500 dark:text-gray-400 text-base">更新日</span>
                            <span className="flex-1 px-3 py-2 text-base text-gray-700 dark:text-gray-300">
                                {getFormatDatetime(new Date(task.updatedAt), 'yyyy-MM-dd HH:mm:ss')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* サブタスクセクション */}
            <SubtaskSectionContainer />

            {/* 削除エリア */}
            <div className="mt-8 sm:mt-[60px] pt-4 sm:pt-[30px] border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 sm:p-5 border border-red-200 dark:border-red-800 rounded bg-red-50 dark:bg-red-900/20">
                    <div>
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">{`${task.categoryName}の削除`}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{`この${task.categoryName}を削除します。削除後は元に戻せません。`}</p>
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
                    <p className="text-gray-700 dark:text-gray-300">
                        {`この${task.categoryName}を削除しますか？`}<br />
                        この操作は取り消せません。
                        {task.subtaskCount > 0 && (
                            <><br /><span className="text-red-600 dark:text-red-400">※{task.subtaskCount}件のサブタスクも削除されます</span></>
                        )}
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
