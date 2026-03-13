import { Pagination, Table } from "@/components";
import { TableProps } from "@/components/ui/table/table";
import { CategoryReturnType } from "@/features/api/get-category";
import { PriorityReturnType } from "@/features/api/get-priority";
import { StatusReturnType } from "@/features/api/get-status";
import { useState } from "react";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { TaskListReturnType } from "../api/get-todo-list";
import { TodoSearchFilter } from "../types/todo-search-filter";
import { TodoCard } from "./todo-card";
import { TodoSearchBar } from "./todo-search-bar";

type PropsType = {
    taskData: TaskListReturnType;
    onRowClick: (entry: TaskListReturnType['list'][number]) => void;
    categoryList: CategoryReturnType;
    statusList: StatusReturnType;
    priorityList: PriorityReturnType;
    searchCondition: TodoSearchFilter;
    setSearchCondition: (condition: TodoSearchFilter) => void;
    clearSearchCondition: () => void;
    clickSearch: () => void;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

// テーブルカラム
const columns: TableProps<TaskListReturnType['list'][number]>['columns'] = [
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

    const {
        taskData,
        onRowClick,
        categoryList,
        statusList,
        priorityList,
        searchCondition,
        setSearchCondition,
        clearSearchCondition,
        clickSearch,
        handleKeyPress, } = props;

    // TODO: API連携後はサーバーから取得したページ情報に差し替える
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    return (
        <div className="w-full min-h-full p-1 sm:p-5 flex flex-col">
            <TodoSearchBar
                searchCondition={searchCondition}
                onChange={setSearchCondition}
                onSearch={clickSearch}
                onClear={clearSearchCondition}
                categoryList={categoryList}
                statusList={statusList}
                priorityList={priorityList}
                handleKeyPress={handleKeyPress}
            />
            {/* TODO: API連携後はレスポンスの件数値に差し替える */}
            <p className="text-sm text-gray-500 mb-3 text-right">全 {taskData.total} 件</p>
            <div className="flex-1">
                {taskData.list.length === 0 ? (
                    <div className="flex h-80 flex-col items-center justify-center gap-3">
                        <HiOutlineArchiveBoxXMark className="size-12 text-gray-300" />
                        <p className="text-[17px] text-gray-400">タスクがありません</p>
                    </div>
                ) : (
                    <>
                        {/* テーブル表示: lg 以上 */}
                        <div className="hidden lg:block border border-gray-200 rounded-md overflow-hidden">
                            <Table
                                data={taskData.list}
                                columns={columns}
                                className="text-[17px] table-fixed
                                    [&_thead]:bg-gray-50/90
                                    [&_thead_tr]:border-b
                                    [&_thead_tr]:border-gray-400/60"
                                rowClassName="h-[50px] border-gray-300/80 hover:bg-gray-100 cursor-pointer"
                                onRowClick={onRowClick}
                            />
                        </div>
                        {/* カード表示: lg 未満 */}
                        <div className="lg:hidden flex flex-col gap-3">
                            {taskData.list.map((entry) => (
                                <TodoCard
                                    key={entry.id}
                                    entry={entry}
                                    onClick={() => onRowClick(entry)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="mt-auto pt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}
