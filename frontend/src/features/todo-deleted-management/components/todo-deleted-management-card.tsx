import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { getFormatDatetime } from "@/utils/date-util";
import { TodoDeletedManagementListReturnType } from "../api/get-todo-deleted-management-list";

type PropsType = {
    entry: TodoDeletedManagementListReturnType['list'][number];
    onClick: () => void;
    isBulkMode?: boolean;
    isSelected?: boolean;
    onSelect?: (checked: boolean) => void;
};

export function TodoDeletedManagementCard({ entry, onClick, isBulkMode = false, isSelected = false, onSelect }: PropsType) {
    return (
        <div
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
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
                <p className="text-[17px] font-medium text-gray-800 dark:text-gray-100 break-words min-w-0 flex-1">{entry.title}</p>
                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap shrink-0 mt-0.5">#{entry.id}</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs">
                <div>
                    <span className="text-gray-400 dark:text-gray-500">ユーザー名</span>
                    <span className="ml-1.5 text-gray-500 dark:text-gray-400">{entry.userName}</span>
                </div>
                <div>
                    <span className="text-gray-400 dark:text-gray-500">カテゴリ</span>
                    <span className="ml-1.5 text-gray-500 dark:text-gray-400">{entry.categoryName}</span>
                </div>
                <div>
                    <span className="text-gray-400 dark:text-gray-500">ステータス</span>
                    <span className="ml-1.5 text-gray-500 dark:text-gray-400">{entry.statusName}</span>
                </div>
                <div>
                    <span className="text-gray-400 dark:text-gray-500">優先度</span>
                    <span className="ml-1.5 text-gray-500 dark:text-gray-400">{entry.priorityName}</span>
                </div>
                {entry.dueDate && (
                    <div>
                        <span className="text-gray-400 dark:text-gray-500">期限日</span>
                        <span className="ml-1.5 text-gray-500 dark:text-gray-400">{entry.dueDate}</span>
                    </div>
                )}
                <div>
                    <span className="text-gray-400 dark:text-gray-500">登録日</span>
                    <span className="ml-1.5 text-gray-500 dark:text-gray-400">{getFormatDatetime(new Date(entry.createdAt), 'yyyy-MM-dd')}</span>
                </div>
                <div>
                    <span className="text-gray-400 dark:text-gray-500">更新日</span>
                    <span className="ml-1.5 text-gray-500 dark:text-gray-400">{getFormatDatetime(new Date(entry.updatedAt), 'yyyy-MM-dd')}</span>
                </div>
            </div>
        </div>
    );
}
