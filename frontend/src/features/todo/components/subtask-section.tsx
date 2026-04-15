import { Button, Table } from "@/components";
import { TableProps } from "@/components/ui/table/table";
import { SubtaskListDataType } from "../api/get-subtask-list";

type PropsType = {
    subtasks: SubtaskListDataType;
    onClickAdd: () => void;
    onClickSubtask: (subId: number) => void;
    isLoading: boolean;
};

const columns: TableProps<SubtaskListDataType[number]>['columns'] = [
    { title: 'ID', field: 'id', className: 'w-[6%] whitespace-nowrap pl-4' },
    {
        title: 'タイトル',
        field: 'title',
        className: 'max-w-0',
        Cell: ({ entry }) => <span className="block truncate">{entry.title}</span>,
    },
    { title: 'ステータス', field: 'statusName', className: 'w-28 whitespace-nowrap' },
    { title: '優先度', field: 'priorityName', className: 'w-20 whitespace-nowrap' },
    {
        title: '期限',
        field: 'dueDate',
        className: 'w-28 whitespace-nowrap',
        Cell: ({ entry }) => <span>{entry.dueDate ?? '-'}</span>,
    },
];

export function SubtaskSection(props: PropsType) {

    const { subtasks, onClickAdd, onClickSubtask, isLoading } = props;

    return (
        <div className="mt-8 sm:mt-[60px]">
            {/* ヘッダー */}
            <div className="flex items-center mb-3 pr-1">
                <span className="font-semibold text-base text-gray-700">サブタスク</span>
                <div className="flex-1" />
                <Button
                    colorType={"blue"}
                    sizeType={"small"}
                    className="bg-blue-500 text-white rounded px-3 sm:px-4 py-1 sm:py-2 text-sm hover:bg-blue-600"
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
                            className="text-sm table-fixed
                                [&_thead]:bg-gray-50/90
                                [&_thead_tr]:border-b
                                [&_thead_tr]:border-gray-200"
                            rowClassName="cursor-pointer hover:bg-gray-50 transition-colors"
                            onRowClick={(entry) => onClickSubtask(entry.id)}
                        />
                    </div>

                    {/* スマホ: カード表示 */}
                    <div className="sm:hidden flex flex-col gap-2">
                        {subtasks.map((subtask) => (
                            <button
                                key={subtask.id}
                                type="button"
                                onClick={() => onClickSubtask(subtask.id)}
                                className="w-full text-left p-3 border border-gray-200 rounded bg-white hover:bg-gray-50 transition-colors"
                            >
                                <p className="text-sm font-medium text-gray-800 truncate">{subtask.title}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {subtask.statusName} / {subtask.priorityName}
                                </p>
                                {subtask.dueDate && (
                                    <p className="text-xs text-gray-500 mt-0.5">期限: {subtask.dueDate}</p>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
