import { CATEGORY_ID } from "@/constants/master";
import { getFormatDatetime } from "@/utils/date-util";
import { getDueDateStatus } from "@/utils/due-date-status";
import { HiArrowLeft } from "react-icons/hi2";
import { ManagementSubtaskDataType } from "../api/get-todo-management-subtask";

type PropsType = {
    task: ManagementSubtaskDataType;
    onClickBack: () => void;
};

export function TodoManagementSubtaskDetailView(props: PropsType) {

    const { task, onClickBack } = props;

    const dueDateStatus = getDueDateStatus(task.dueDate);

    return (
        <div className="w-full min-h-full flex flex-col pb-4">
            {/* 親タスク詳細に戻る */}
            <div className="mb-4">
                <button
                    type="button"
                    onClick={onClickBack}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                    <HiArrowLeft />
                    <span>親タスク詳細に戻る</span>
                </button>
            </div>

            {/* ヘッダー */}
            <div className="flex items-center pr-[10px]">
                <span className="font-bold text-[18px] sm:text-[22px]">
                    サブタスク詳細
                </span>
            </div>

            {/* コンテンツ */}
            <div className="w-full pt-7 sm:pt-[50px] text-[15px] flex-1">
                <div className="w-full">
                    <p className="text-base text-gray-400 mb-1 pl-0.5">タイトル</p>
                    <p className="w-full px-0.5 text-2xl font-semibold break-words">
                        {task.title}
                    </p>
                </div>
                <div className="w-full p-3 sm:p-[20px] border border-[#c0c0c0] rounded mt-3 sm:mt-[20px] bg-white">
                    <div className="mb-3">
                        <p className="text-base text-gray-500">{task.categoryName}内容</p>
                    </div>
                    <p className="w-full min-h-[450px] text-lg whitespace-pre-wrap leading-relaxed text-gray-800 break-words">
                        {task.content}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%] pt-[20px] mt-[20px] border-t border-[#e8e8e8]">
                        <div className="flex flex-1 items-start gap-2">
                            <span className="whitespace-nowrap w-[5em] text-gray-500 text-base pt-2">親タスク</span>
                            <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-lg break-words">
                                {task.parentTitle}
                            </span>
                        </div>
                    </div>
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
                                    {task.dueDate ? task.dueDate : 'なし'}
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
        </div>
    );
}
