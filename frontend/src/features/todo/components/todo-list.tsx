import { Table } from "@/components";
import { TableProps } from "@/components/ui/table/table";
import { TaskListType } from "../api/get-todo-list";

type PropsType = {
    taskList: TaskListType;
}

const columns: TableProps<TaskListType[number]>['columns'] = [
    { title: 'ID', field: 'id' },
    { title: 'タイトル', field: 'title' },
    { title: '登録日', field: 'createdAt' },
];

export function TodoList(props: PropsType) {

    return (
        <div className="w-full min-h-full p-5">
            <Table
                data={props.taskList}
                columns={columns}
            />
        </div>
    );
}