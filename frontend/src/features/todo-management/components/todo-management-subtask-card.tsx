import { Badge } from "@/components/ui/badge/badge";
import { getFormatDatetime } from "@/utils/date-util";
import { getPriorityBadgeColor, getStatusBadgeColor } from "@/utils/task-attribute-colors";
import { dateColorMap, getDueDateStatus } from "@/utils/due-date-status";
import { ManagementSubtaskListDataType } from "../api/get-todo-management-subtask-list";

type PropsType = {
    entry: ManagementSubtaskListDataType[number];
    onClick: () => void;
};

export function TodoManagementSubtaskCard({ entry, onClick }: PropsType) {
    const status = getDueDateStatus(entry.dueDate);
    const dateColor = dateColorMap[status];

    return (
        <div
            onClick={onClick}
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-start gap-3">
                <p className="text-[17px] font-medium text-gray-800 break-words min-w-0 flex-1">{entry.title}</p>
                <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 mt-0.5">#{entry.id}</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 pt-3 border-t border-gray-100 text-xs">
                <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">ステータス</span>
                    <Badge label={entry.statusName} bgColor={getStatusBadgeColor(entry.statusId)} />
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">優先度</span>
                    <Badge label={entry.priorityName} bgColor={getPriorityBadgeColor(entry.priorityId)} />
                </div>
                {entry.dueDate && (
                    <div>
                        <span className="text-gray-400">期限日</span>
                        <span className={`ml-1.5 ${dateColor}`}>{entry.dueDate}</span>
                    </div>
                )}
                <div>
                    <span className="text-gray-400">登録日</span>
                    <span className="ml-1.5 text-gray-500">{getFormatDatetime(new Date(entry.createdAt), 'yyyy-MM-dd')}</span>
                </div>
                <div>
                    <span className="text-gray-400">更新日</span>
                    <span className="ml-1.5 text-gray-500">{getFormatDatetime(new Date(entry.updatedAt), 'yyyy-MM-dd')}</span>
                </div>
            </div>
        </div>
    );
}
