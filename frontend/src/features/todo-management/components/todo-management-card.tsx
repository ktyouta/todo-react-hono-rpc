import { Badge } from "@/components/ui/badge/badge";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { CATEGORY_COLOR_MAP, PRIORITY_COLOR_MAP, STATUS_COLOR_MAP } from "@/constants/task-attribute-colors";
import { dateColorMap, getDueDateStatus } from "@/utils/due-date-status";
import { TaskManagementListReturnType } from "../api/get-todo-management-list";

type PropsType = {
    entry: TaskManagementListReturnType['list'][number];
    onClick: () => void;
    isBulkMode: boolean;
    isSelected: boolean;
    onSelect: (checked: boolean) => void;
};

export function TodoManagementCard({ entry, onClick, isBulkMode = false, isSelected = false, onSelect }: PropsType) {
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
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 pt-3 border-t border-gray-100 text-xs">
                <div>
                    <span className="text-gray-400">ユーザー</span>
                    <span className="ml-1.5 text-gray-500">{entry.userName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">カテゴリ</span>
                    <Badge label={entry.categoryName} bgColor={CATEGORY_COLOR_MAP[entry.categoryId]} />
                </div>
                {entry.statusName && (
                    <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">ステータス</span>
                        <Badge label={entry.statusName} bgColor={entry.statusId != null ? STATUS_COLOR_MAP[entry.statusId] : undefined} />
                    </div>
                )}
                {entry.priorityName && (
                    <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">優先度</span>
                        <Badge label={entry.priorityName} bgColor={entry.priorityId != null ? PRIORITY_COLOR_MAP[entry.priorityId] : undefined} />
                    </div>
                )}
                {entry.dueDate && (() => {
                    const status = getDueDateStatus(entry.dueDate);
                    const dateStr = entry.dueDate;
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
                    <span className="ml-1.5 text-gray-500">{entry.createdAt.slice(0, 10)}</span>
                </div>
                <div>
                    <span className="text-gray-400">更新日</span>
                    <span className="ml-1.5 text-gray-500">{entry.updatedAt.slice(0, 10)}</span>
                </div>
            </div>
        </div>
    );
}
