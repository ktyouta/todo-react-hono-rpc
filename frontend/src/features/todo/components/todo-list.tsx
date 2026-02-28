import { Table } from "@/components";
import { TableProps } from "@/components/ui/table/table";
import { TaskListType } from "../api/get-todo-list";

type PropsType = {
    taskList: TaskListType;
    onRowClick: (entry: TaskListType[number]) => void;
}

const columns: TableProps<TaskListType[number]>['columns'] = [
    { title: 'ID', field: 'id', className: 'w-[8%] whitespace-nowrap' },
    { title: 'タイトル', field: 'title' },
    { title: '登録日', field: 'createdAt', className: 'w-[13%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.createdAt.slice(0, 10)}</span> },
    { title: '更新日', field: 'updatedAt', className: 'w-[13%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.updatedAt.slice(0, 10)}</span> },
];

export function TodoList(props: PropsType) {

    return (
        <div className="w-full min-h-full p-5">
            <Table
                data={props.taskList}
                columns={columns}
                className="text-[17px] table-fixed"
                rowClassName="h-[50px]"
                onRowClick={props.onRowClick}
            />
        </div>
    );
}