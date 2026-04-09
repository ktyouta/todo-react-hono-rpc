import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { dateColorMap, getDueDateStatus } from "@/utils/due-date-status";
import { TodoTrashListReturnType } from "../api/get-todo-trash-list";

type PropsType = {
    entry: TodoTrashListReturnType['list'][number];
    onClick: () => void;
    isBulkMode?: boolean;
    isSelected?: boolean;
    onSelect?: (checked: boolean) => void;
};

export function TodoTrashCard({ entry, onClick, isBulkMode = false, isSelected = false, onSelect }: PropsType) {
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
                            onChange={(checked) => onSelect?.(checked)}
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
                    <span className="text-gray-400">カテゴリ</span>
                    <span className="ml-1.5 text-gray-500">{entry.categoryName}</span>
                </div>
                <div>
                    <span className="text-gray-400">ステータス</span>
                    <span className="ml-1.5 text-gray-500">{entry.statusName}</span>
                </div>
                <div>
                    <span className="text-gray-400">優先度</span>
                    <span className="ml-1.5 text-gray-500">{entry.priorityName}</span>
                </div>
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
