import { Table } from "@/components";
import { TableProps } from "@/components/ui/table/table";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { TaskListReturnType } from "../api/get-todo-list";
import { TodoCard } from "./todo-card";

type PropsType = {
    taskList: TaskListReturnType;
    onRowClick: (entry: TaskListReturnType[number]) => void;
}

// テーブルカラム
const columns: TableProps<TaskListReturnType[number]>['columns'] = [
    { title: 'ID', field: 'id', className: 'w-[6%] whitespace-nowrap' },
    { title: 'タイトル', field: 'title', className: 'max-w-0', Cell: ({ entry }) => <span className="block truncate">{entry.title}</span> },
    { title: 'カテゴリ', field: 'categoryName', className: 'w-[10%] whitespace-nowrap' },
    { title: 'ステータス', field: 'statusName', className: 'w-[10%] whitespace-nowrap' },
    { title: '優先度', field: 'priorityName', className: 'w-[8%] whitespace-nowrap' },
    { title: '期限日', field: 'dueDate', className: 'w-[11%] whitespace-nowrap', Cell: ({ entry }) => <span>{entry.dueDate ? entry.dueDate.replaceAll('-', '/') : '—'}</span> },
    { title: '登録日', field: 'createdAt', className: 'w-[10%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.createdAt.slice(0, 10)}</span> },
    { title: '更新日', field: 'updatedAt', className: 'w-[10%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.updatedAt.slice(0, 10)}</span> },
];

export function TodoList(props: PropsType) {

    if (!props.taskList.length) {
        return (
            <div className="w-full min-h-full p-2 sm:p-5">
                <div className="flex h-80 flex-col items-center justify-center gap-3">
                    <HiOutlineArchiveBoxXMark className="size-12 text-gray-300" />
                    <p className="text-[17px] text-gray-400">タスクがありません</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-full p-1 sm:p-5">
            {/* テーブル表示: lg 以上 */}
            <div className="hidden lg:block">
                <Table
                    data={props.taskList}
                    columns={columns}
                    className="text-[17px] table-fixed
                        [&_thead]:bg-gray-50/90
                        [&_thead_tr]:border-b
                        [&_thead_tr]:border-gray-400/60"
                    rowClassName="h-[50px] border-gray-300/80 hover:bg-gray-100 cursor-pointer"
                    onRowClick={props.onRowClick}
                />
            </div>
            {/* カード表示: md 未満 */}
            <div className="lg:hidden flex flex-col gap-3">
                {props.taskList.map((entry) => (
                    <TodoCard
                        key={entry.id}
                        entry={entry}
                        onClick={() => props.onRowClick(entry)}
                    />
                ))}
            </div>
        </div>
    );
}
