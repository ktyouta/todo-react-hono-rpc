import { Pagination, Table } from "@/components";
import { Badge } from "@/components/ui/badge/badge";
import { PRIORITY_COLOR_MAP, STATUS_COLOR_MAP } from "@/constants/task-attribute-colors";
import { TableProps } from "@/components/ui/table/table";
import { TodoTrashSubtaskListDataType } from "../api/get-todo-trash-subtask-list";
import { getFormatDatetime } from "@/utils/date-util";
import { TodoTrashSubtaskCard } from "./todo-trash-subtask-card";

type PropsType = {
    subtasks: TodoTrashSubtaskListDataType;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading: boolean;
};

const columns: TableProps<TodoTrashSubtaskListDataType[number]>['columns'] = [
    { title: 'ID', field: 'id', className: 'w-[6%] whitespace-nowrap pl-4' },
    { title: 'タイトル', field: 'title', Cell: ({ entry }) => <span className="whitespace-nowrap">{entry.title}</span> },
    { title: 'ステータス', field: 'statusName', className: 'w-[12%] whitespace-nowrap', Cell: ({ entry }) => <Badge label={entry.statusName} bgColor={entry.statusId != null ? STATUS_COLOR_MAP[entry.statusId] : undefined} /> },
    { title: '優先度', field: 'priorityName', className: 'w-[10%] whitespace-nowrap', Cell: ({ entry }) => <Badge label={entry.priorityName} bgColor={entry.priorityId != null ? PRIORITY_COLOR_MAP[entry.priorityId] : undefined} /> },
    { title: '期限日', field: 'dueDate', className: 'w-[10%] whitespace-nowrap', Cell: ({ entry }) => <span>{entry.dueDate ?? '—'}</span> },
    { title: '登録日', field: 'createdAt', className: 'w-[9%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{getFormatDatetime(new Date(entry.createdAt), 'yyyy-MM-dd')}</span> },
    { title: '更新日', field: 'updatedAt', className: 'w-[9%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{getFormatDatetime(new Date(entry.updatedAt), 'yyyy-MM-dd')}</span> },
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
                            className="text-[16px] min-w-[700px]
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
                            <TodoTrashSubtaskCard key={subtask.id} entry={subtask} />
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
