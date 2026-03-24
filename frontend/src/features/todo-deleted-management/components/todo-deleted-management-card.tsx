import { getDueDateStatus } from "@/features/todo/utils/due-date-status";
import { TodoDeletedManagementListReturnType } from "../api/get-todo-deleted-management-list";

type PropsType = {
    entry: TodoDeletedManagementListReturnType['list'][number];
    onClick: () => void;
};

export function TodoDeletedManagementCard({ entry, onClick }: PropsType) {
    const dueDateStatus = getDueDateStatus(entry.dueDate);

    return (
        <div
            className="border border-gray-200 rounded-md p-4 bg-white cursor-pointer hover:bg-gray-50"
            onClick={onClick}
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-medium text-base break-words flex-1">{entry.title}</p>
                <span className="text-xs text-gray-400 shrink-0">#{entry.id}</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                <span>{entry.userName}</span>
                <span>{entry.categoryName}</span>
                {entry.statusName && <span>{entry.statusName}</span>}
                {entry.priorityName && <span>{entry.priorityName}</span>}
            </div>
            {entry.dueDate && (
                <p className={`text-sm mt-1 ${dueDateStatus === 'overdue' ? 'text-red-600' : dueDateStatus === 'warning' ? 'text-amber-500' : 'text-gray-500'}`}>
                    期限: {entry.dueDate.replaceAll('-', '/')}
                </p>
            )}
            <div className="flex gap-4 text-xs text-gray-400 mt-2">
                <span>登録: {entry.createdAt.slice(0, 10)}</span>
                <span>更新: {entry.updatedAt.slice(0, 10)}</span>
            </div>
        </div>
    );
}
