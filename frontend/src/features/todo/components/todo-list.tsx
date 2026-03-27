import { LoadingOverlay, Pagination, Table } from "@/components";
import { TableProps } from "@/components/ui/table/table";
import { CategoryReturnType } from "@/features/api/get-category";
import { PriorityReturnType } from "@/features/api/get-priority";
import { StatusReturnType } from "@/features/api/get-status";
import { HiOutlineArchiveBoxXMark, HiOutlineStar, HiStar } from "react-icons/hi2";
import { TaskListDataType } from "../api/get-todo-list";
import { TodoSearchFilter } from "../types/todo-search-filter";
import { getDueDateStatus } from "../utils/due-date-status";
import { TodoCard } from "./todo-card";
import { TodoSearchBar } from "./todo-search-bar";

type PropsType = {
    taskData: TaskListDataType;
    onRowClick: (entry: TaskListDataType['list'][number]) => void;
    onFavoriteToggle: (entry: TaskListDataType['list'][number]) => void;
    categoryList: CategoryReturnType;
    statusList: StatusReturnType;
    priorityList: PriorityReturnType;
    searchCondition: TodoSearchFilter;
    setSearchCondition: (condition: TodoSearchFilter) => void;
    clearSearchCondition: () => void;
    clickSearch: () => void;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    currentPage: number;
    changePage: (page: number) => void;
    isShowOverlay: boolean;
}

export function TodoList(props: PropsType) {

    const {
        taskData,
        onRowClick,
        onFavoriteToggle,
        categoryList,
        statusList,
        priorityList,
        searchCondition,
        setSearchCondition,
        clearSearchCondition,
        clickSearch,
        handleKeyPress,
        currentPage,
        changePage,
        isShowOverlay, } = props;

    // テーブルカラム
    const columns: TableProps<TaskListDataType['list'][number]>['columns'] = [
        { title: 'ID', field: 'id', className: 'w-[6%] whitespace-nowrap' },
        { title: 'タイトル', field: 'title', className: 'max-w-0', Cell: ({ entry }) => <span className="block truncate">{entry.title}</span> },
        { title: 'カテゴリ', field: 'categoryName', className: 'w-[10%] whitespace-nowrap' },
        { title: 'ステータス', field: 'statusName', className: 'w-[10%] whitespace-nowrap' },
        { title: '優先度', field: 'priorityName', className: 'w-[8%] whitespace-nowrap' },
        {
            title: '期限日', field: 'dueDate', className: 'w-[9%] whitespace-nowrap', Cell: ({ entry }) => {
                if (!entry.dueDate) {
                    return <span>—</span>;
                }

                const status = getDueDateStatus(entry.dueDate);
                const dateStr = entry.dueDate;

                if (status === 'overdue') {
                    return <span className="text-red-600">{dateStr}</span>;
                }

                if (status === 'warning') {
                    return <span className="text-amber-500">{dateStr}</span>;
                }

                return <span>{dateStr}</span>;
            }
        },
        { title: '登録日', field: 'createdAt', className: 'w-[9%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.createdAt.slice(0, 10)}</span> },
        { title: '更新日', field: 'updatedAt', className: 'w-[9%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.updatedAt.slice(0, 10)}</span> },
        {
            title: '', field: 'isFavorite', className: 'w-[4%] whitespace-nowrap text-center', Cell: ({ entry }) => (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onFavoriteToggle(entry);
                    }}
                    className="flex items-center justify-center mx-auto"
                >
                    {entry.isFavorite
                        ? <HiStar className="size-5 text-amber-400" />
                        : <HiOutlineStar className="size-5 text-gray-400" />
                    }
                </button>
            )
        },
    ];

    return (
        <div className="w-full min-h-full p-1 sm:p-5 flex flex-col">
            {isShowOverlay && <LoadingOverlay />}
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
            <p className="text-sm text-gray-500 mb-3 text-right pr-2">全 {taskData.total} 件</p>
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
                                rowClassName="h-[50px] border-gray-300/80 hover:bg-[#EFEFEF] cursor-pointer"
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
                                    onFavoriteToggle={() => onFavoriteToggle(entry)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="mt-auto pt-4">
                {taskData.totalPages > 1 &&
                    <Pagination
                        currentPage={currentPage}
                        totalPages={taskData.totalPages}
                        onPageChange={changePage}
                    />
                }
            </div>
        </div>
    );
}
