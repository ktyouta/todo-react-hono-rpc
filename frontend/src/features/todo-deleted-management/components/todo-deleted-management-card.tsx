import { getDueDateStatus } from "@/features/todo/utils/due-date-status";
import { TodoDeletedManagementListReturnType } from "../api/get-todo-deleted-management-list";

type PropsType = {
    entry: TodoDeletedManagementListReturnType['list'][number];
    onClick: () => void;
};

export function TodoDeletedManagementCard({ entry, onClick }: PropsType) {
    return (
        <div
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={onClick}
        >
            <div className="flex items-start justify-between gap-3">
                <p className="text-[17px] font-medium text-gray-800 break-words min-w-0">{entry.title}</p>
                <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 mt-0.5">#{entry.id}</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 pt-3 border-t border-gray-100 text-xs">
                <div>
                    <span className="text-gray-400">ユーザー名</span>
                    <span className="ml-1.5 text-gray-500">{entry.userName}</span>
                </div>
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

                    if (status === 'overdue') {
                        return (
                            <div>
                                <span className="text-gray-400">期限日</span>
                                <span className="ml-1.5 text-red-600">{dateStr}</span>
                            </div>
                        );
                    }

                    if (status === 'warning') {
                        return (
                            <div>
                                <span className="text-gray-400">期限日</span>
                                <span className="ml-1.5 text-amber-500">{dateStr}</span>
                            </div>
                        );
                    }

                    return (
                        <div>
                            <span className="text-gray-400">期限日</span>
                            <span className="ml-1.5 text-gray-500">{dateStr}</span>
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
