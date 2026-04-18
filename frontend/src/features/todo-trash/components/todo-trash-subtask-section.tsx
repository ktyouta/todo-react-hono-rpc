import { Pagination, Table } from "@/components";
import { TableProps } from "@/components/ui/table/table";
import { TodoTrashSubtaskListDataType } from "../api/get-todo-trash-subtask-list";

type PropsType = {
    subtasks: TodoTrashSubtaskListDataType;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading: boolean;
};

const columns: TableProps<TodoTrashSubtaskListDataType[number]>['columns'] = [
    { title: 'ID', field: 'id', className: 'w-[6%] whitespace-nowrap pl-4' },
    { title: 'タイトル', field: 'title', className: 'max-w-0', Cell: ({ entry }) => <span className="block truncate">{entry.title}</span> },
    { title: 'ステータス', field: 'statusName', className: 'w-[12%] whitespace-nowrap' },
    { title: '優先度', field: 'priorityName', className: 'w-[10%] whitespace-nowrap' },
    { title: '期限日', field: 'dueDate', className: 'w-[10%] whitespace-nowrap', Cell: ({ entry }) => <span>{entry.dueDate ?? '—'}</span> },
];

export function TodoTrashSubtaskSection(props: PropsType) {

    const { subtasks, currentPage, totalPages, onPageChange, isLoading } = props;

    return (
        <div className="mt-8 sm:mt-[60px]">
            <div className="flex items-center mb-3 pr-1">
                <span className="font-semibold text-base text-gray-700">サブタスク</span>
            </div>

            {isLoading ? (
                <div className="py-6 text-center text-sm text-gray-400">読み込み中...</div>
            ) : subtasks.length === 0 ? (
                <div className="py-6 text-center text-sm text-gray-400">サブタスクはありません</div>
            ) : (
                <>
                    {/* PC: テーブル表示 */}
                    <div className="hidden sm:block border border-gray-200 rounded overflow-hidden">
                        <Table
                            data={subtasks}
                            columns={columns}
                            className="text-[16px] table-fixed
                                [&_thead]:bg-gray-200/70
                                [&_thead_tr]:border-b
                                [&_thead_tr]:border-gray-400/60
                                [&_thead_tr]:hover:bg-transparent"
                            rowClassName="h-[50px] border-gray-300/80 bg-white/50"
                        />
                    </div>
                    {/* スマホ: カード表示 */}
                    <div className="sm:hidden flex flex-col gap-2">
                        {subtasks.map((subtask) => (
                            <div
                                key={subtask.id}
                                className="bg-white border border-gray-200 rounded-lg p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <p className="text-[17px] font-medium text-gray-800 break-words min-w-0 flex-1">{subtask.title}</p>
                                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 mt-0.5">#{subtask.id}</span>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 pt-3 border-t border-gray-100 text-xs">
                                    <div>
                                        <span className="text-gray-400">ステータス</span>
                                        <span className="ml-1.5 text-gray-500">{subtask.statusName}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">優先度</span>
                                        <span className="ml-1.5 text-gray-500">{subtask.priorityName}</span>
                                    </div>
                                    {subtask.dueDate && (
                                        <div>
                                            <span className="text-gray-400">期限日</span>
                                            <span className="ml-1.5 text-gray-500">{subtask.dueDate}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
}
