import { TaskListType } from "../api/get-todo-list";

type PropsType = {
    entry: TaskListType[number];
    onClick: () => void;
}

export function TodoCard({ entry, onClick }: PropsType) {
    return (
        <div
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={onClick}
        >
            <div className="flex items-start justify-between gap-3">
                <p className="text-[17px] font-medium text-gray-800 break-words min-w-0">{entry.title}</p>
                <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 mt-0.5">#{entry.id}</span>
            </div>
            <div className="flex gap-6 mt-3 pt-3 border-t border-gray-100 text-xs">
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
