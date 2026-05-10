import { Badge } from "@/components/ui/badge/badge";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { STATUS_ID } from "@/constants/master";
import { CATEGORY_COLOR_MAP } from "@/constants/task-attribute-colors";
import { getFormatDatetime } from "@/utils/date-util";
import { getPriorityBadgeColor, getStatusBadgeColor } from "@/utils/task-attribute-colors";
import { dateColorMap, getDueDateStatus } from "@/utils/due-date-status";
import { HiOutlineStar, HiStar } from "react-icons/hi2";
import { TaskListDataType } from "../api/get-todo-list";

type PropsType = {
    entry: TaskListDataType['list'][number];
    onClick: () => void;
    onFavoriteToggle: () => void;
    isBulkMode: boolean;
    isSelected: boolean;
    onSelect: (checked: boolean) => void;
}

export function TodoCard({ entry, onClick, onFavoriteToggle, isBulkMode = false, isSelected = false, onSelect }: PropsType) {
    return (
        <div
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                {isBulkMode && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                            checked={isSelected}
                            onChange={(checked) => onSelect(checked)}
                            size="medium"
                            className="mt-0.5 shrink-0"
                        />
                    </div>
                )}
                <p className="text-[17px] font-medium text-gray-800 break-words min-w-0 flex-1">{entry.title}</p>
                <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 mt-0.5">#{entry.id}</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 pt-3 border-t border-gray-100 text-xs relative">
                <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">カテゴリ</span>
                    <Badge label={entry.categoryName} bgColor={CATEGORY_COLOR_MAP[entry.categoryId]} />
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">ステータス</span>
                    <Badge label={entry.statusName} bgColor={getStatusBadgeColor(entry.statusId)} />
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">優先度</span>
                    <Badge label={entry.priorityName} bgColor={getPriorityBadgeColor(entry.priorityId)} />
                </div>
                {entry.dueDate && (() => {
                    const dateStr = entry.dueDate;
                    if (entry.statusId === STATUS_ID.COMPLETED) {
                        return (
                            <div>
                                <span className="text-gray-400">期限日</span>
                                <span className="ml-1.5 text-gray-500">{dateStr}</span>
                            </div>
                        );
                    }
                    const status = getDueDateStatus(dateStr);
                    const dateColor = dateColorMap[status];
                    return (
                        <div>
                            <span className="text-gray-400">期限日</span>
                            <span className={`ml-1.5 ${dateColor}`}>{dateStr}</span>
                        </div>
                    );
                })()}
                <div>
                    <span className="text-gray-400">登録日</span>
                    <span className="ml-1.5 text-gray-500">{getFormatDatetime(new Date(entry.createdAt), 'yyyy-MM-dd')}</span>
                </div>
                <div>
                    <span className="text-gray-400">更新日</span>
                    <span className="ml-1.5 text-gray-500">{getFormatDatetime(new Date(entry.updatedAt), 'yyyy-MM-dd')}</span>
                </div>
                {!isBulkMode && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onFavoriteToggle();
                        }}
                        className="absolute bottom-0 right-0 flex items-center justify-center"
                    >
                        {entry.isFavorite
                            ? <HiStar className="size-5 text-amber-400" />
                            : <HiOutlineStar className="size-5 text-gray-400" />
                        }
                    </button>
                )}
            </div>
        </div>
    );
}
