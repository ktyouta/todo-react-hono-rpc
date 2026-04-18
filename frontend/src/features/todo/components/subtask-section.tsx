import { Button, Pagination, Table } from "@/components";
import { TableProps } from "@/components/ui/table/table";
import { SubtaskListDataType } from "../api/get-subtask-list";
import { SubtaskCard } from "./subtask-card";

type PropsType = {
    subtasks: SubtaskListDataType;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onClickAdd: () => void;
    onClickSubtask: (subId: number) => void;
    isLoading: boolean;
};

const columns: TableProps<SubtaskListDataType[number]>['columns'] = [
    { title: 'ID', field: 'id', className: 'w-[6%] whitespace-nowrap pl-4' },
    { title: 'タイトル', field: 'title', className: 'max-w-0', Cell: ({ entry }) => <span className="block truncate">{entry.title}</span>, },
    { title: 'ステータス', field: 'statusName', className: 'w-[10%] whitespace-nowrap' },
    { title: '優先度', field: 'priorityName', className: 'w-[10%] whitespace-nowrap' },
    { title: '期限', field: 'dueDate', className: 'w-[9%] whitespace-nowrap', Cell: ({ entry }) => <span>{entry.dueDate ?? '-'}</span>, },
    { title: '登録日', field: 'createdAt', className: 'w-[9%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.createdAt.slice(0, 10)}</span> },
    { title: '更新日', field: 'updatedAt', className: 'w-[9%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.updatedAt.slice(0, 10)}</span> },
];

export function SubtaskSection(props: PropsType) {

    const { subtasks, currentPage, totalPages, onPageChange, onClickAdd, onClickSubtask, isLoading } = props;

    return (
        <div className="mt-8 sm:mt-[60px]">
            {/* ヘッダー */}
            <div className="flex items-center mb-3 pr-1">
                <span className="font-semibold text-base text-gray-700">サブタスク</span>
                <div className="flex-1" />
                <Button
                    colorType={"blue"}
                    sizeType={"medium"}
                    className="bg-blue-500 text-white rounded px-3 sm:px-4 py-1 sm:py-2 hover:bg-blue-600"
                    onClick={onClickAdd}
                >
                    + 追加
                </Button>
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
                            rowClassName="h-[50px] border-gray-300/80 bg-white/50 cursor-pointer"
                            onRowClick={(entry) => onClickSubtask(entry.id)}
                        />
                    </div>

                    {/* スマホ: カード表示 */}
                    <div className="sm:hidden flex flex-col gap-2">
                        {subtasks.map((subtask) => (
                            <SubtaskCard
                                key={subtask.id}
                                entry={subtask}
                                onClick={() => onClickSubtask(subtask.id)}
                            />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                            className="mt-3"
                        />
                    )}
                </>
            )}
        </div>
    );
}
