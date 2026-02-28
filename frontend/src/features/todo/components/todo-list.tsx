import { Table } from "@/components";
import { TableProps } from "@/components/ui/table/table";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { TaskListType } from "../api/get-todo-list";
import { TodoCard } from "./todo-card";

type PropsType = {
    taskList: TaskListType;
    onRowClick: (entry: TaskListType[number]) => void;
}

// テーブルカラム
const columns: TableProps<TaskListType[number]>['columns'] = [
    { title: 'ID', field: 'id', className: 'w-[8%] whitespace-nowrap' },
    { title: 'タイトル', field: 'title' },
    { title: '登録日', field: 'createdAt', className: 'w-[13%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.createdAt.slice(0, 10)}</span> },
    { title: '更新日', field: 'updatedAt', className: 'w-[13%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.updatedAt.slice(0, 10)}</span> },
];

export function TodoList(props: PropsType) {

    if (!props.taskList.length) {
        return (
            <div className="w-full min-h-full p-5">
                <div className="flex h-80 flex-col items-center justify-center bg-white text-gray-500">
                    <HiOutlineArchiveBoxXMark className="size-16" />
                    <h4>No Entries Found</h4>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-full p-5">
            {/* テーブル表示: md 以上 */}
            <div className="hidden lg:block">
                <Table
                    data={props.taskList}
                    columns={columns}
                    className="text-[17px] table-fixed"
                    rowClassName="h-[50px]"
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
