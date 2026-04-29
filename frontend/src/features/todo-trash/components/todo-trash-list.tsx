import { LoadingOverlay, Pagination, Table } from "@/components";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { TableProps } from "@/components/ui/table/table";
import { CategoryReturnType } from "@/features/api/get-category";
import { PriorityReturnType } from "@/features/api/get-priority";
import { StatusReturnType } from "@/features/api/get-status";
import { getDueDateStatus } from "@/utils/due-date-status";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { TodoTrashListReturnType } from "../api/get-todo-trash-list";
import { UseTodoTrashBulkReturn } from "../hooks/use-todo-trash-bulk";
import { TodoTrashSearchFilter } from "../types/todo-trash-search-filter";
import { TodoTrashActionBar } from "./todo-trash-action-bar";
import { TodoTrashBulkRestoreDialog } from "./todo-trash-bulk-restore-dialog";
import { TodoTrashCard } from "./todo-trash-card";
import { TodoTrashSearchBar } from "./todo-trash-search-bar";

type PropsType = {
    taskData: TodoTrashListReturnType;
    onRowClick: (entry: TodoTrashListReturnType['list'][number]) => void;
    categoryList: CategoryReturnType;
    statusList: StatusReturnType;
    priorityList: PriorityReturnType;
    searchCondition: TodoTrashSearchFilter;
    setSearchCondition: (condition: TodoTrashSearchFilter) => void;
    clearSearchCondition: () => void;
    clickSearch: () => void;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    currentPage: number;
    changePage: (page: number) => void;
    isShowOverlay: boolean;
    bulk: UseTodoTrashBulkReturn;
};

export function TodoTrashList(props: PropsType) {

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
        handleKeyPress,
        currentPage,
        changePage,
        isShowOverlay,
        bulk,
    } = props;

    // テーブルカラム
    const columns: TableProps<TodoTrashListReturnType['list'][number]>['columns'] = [
        ...(bulk.isBulkMode ? [{
            title: '',
            field: 'id' as const,
            className: 'w-[4%] whitespace-nowrap text-center',
            Cell: ({ entry }: { entry: TodoTrashListReturnType['list'][number] }) => (
                <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                        checked={bulk.selectedIds.includes(entry.id)}
                        onChange={(checked) => bulk.onSelectItem(entry.id, checked)}
                        size="medium"
                    />
                </div>
            ),
        }] : []),
        { title: 'ID', field: 'id', className: 'w-[5%] whitespace-nowrap pl-4' },
        { title: 'タイトル', field: 'title', Cell: ({ entry }) => <span className="whitespace-nowrap">{entry.title}</span> },
        { title: 'カテゴリ', field: 'categoryName', className: 'w-[9%] whitespace-nowrap' },
        { title: 'ステータス', field: 'statusName', className: 'w-[10%] whitespace-nowrap' },
        { title: '優先度', field: 'priorityName', className: 'w-[8%] whitespace-nowrap' },
        {
            title: '期限日', field: 'dueDate', className: 'w-[8%] whitespace-nowrap', Cell: ({ entry }) => {
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
        {
            title: '親タスクID', field: 'parentId', className: 'w-[8%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => (
                <span>{entry.parentId ?? '—'}</span>
            )
        },
        { title: '登録日', field: 'createdAt', className: 'w-[10%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.createdAt.slice(0, 10)}</span> },
        { title: '更新日', field: 'updatedAt', className: 'w-[10%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.updatedAt.slice(0, 10)}</span> },
    ];

    return (
        <div className="w-full min-h-full p-1 sm:p-5 flex flex-col">
            {isShowOverlay && <LoadingOverlay />}

            {/* 検索バー / アクションバー 切替 */}
            {bulk.isBulkMode ? (
                <TodoTrashActionBar
                    selectedCount={bulk.selectedIds.length}
                    isAllSelected={bulk.isAllSelected}
                    onSelectAll={bulk.onSelectAll}
                    onOpenBulkRestoreDialog={bulk.onOpenBulkRestoreDialog}
                    onCancel={bulk.onToggleBulkMode}
                />
            ) : (
                <TodoTrashSearchBar
                    searchCondition={searchCondition}
                    onChange={setSearchCondition}
                    onSearch={clickSearch}
                    onClear={clearSearchCondition}
                    categoryList={categoryList}
                    statusList={statusList}
                    priorityList={priorityList}
                    handleKeyPress={handleKeyPress}
                    onToggleBulkMode={bulk.onToggleBulkMode}
                />
            )}

            <p className="text-sm text-gray-500 mb-3 text-right pr-2">全 {taskData.total} 件</p>
            <div className="flex-1">
                {taskData.list.length === 0 ? (
                    <div className="flex h-80 flex-col items-center justify-center gap-3">
                        <HiOutlineArchiveBoxXMark className="size-12 text-gray-300" />
                        <p className="text-[17px] text-gray-400">ゴミ箱にタスクがありません</p>
                    </div>
                ) : (
                    <>
                        {/* テーブル表示: lg 以上 */}
                        <div className="hidden lg:block border border-gray-200 rounded-md overflow-hidden">
                            <Table
                                data={taskData.list}
                                columns={columns}
                                className="text-[17px] min-w-[1000px]
                                    [&_thead]:bg-gray-50/90
                                    [&_thead_tr]:border-b
                                    [&_thead_tr]:border-gray-400/60"
                                rowClassName="h-[50px] border-gray-300/80 hover:bg-[#EFEFEF] cursor-pointer"
                                onRowClick={bulk.isBulkMode
                                    ? (entry) => bulk.onSelectItem(entry.id, !bulk.selectedIds.includes(entry.id))
                                    : onRowClick
                                }
                            />
                        </div>
                        {/* カード表示: lg 未満 */}
                        <div className="lg:hidden flex flex-col gap-3">
                            {taskData.list.map((entry) => (
                                <TodoTrashCard
                                    key={entry.id}
                                    entry={entry}
                                    onClick={() => bulk.isBulkMode
                                        ? bulk.onSelectItem(entry.id, !bulk.selectedIds.includes(entry.id))
                                        : onRowClick(entry)
                                    }
                                    isBulkMode={bulk.isBulkMode}
                                    isSelected={bulk.selectedIds.includes(entry.id)}
                                    onSelect={(checked) => bulk.onSelectItem(entry.id, checked)}
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

            {/* 一括復元ダイアログ */}
            <TodoTrashBulkRestoreDialog
                isOpen={bulk.isBulkRestoreDialogOpen}
                selectedCount={bulk.selectedIds.length}
                isLoading={bulk.isBulkRestoreLoading}
                onClose={bulk.onCloseBulkRestoreDialog}
                onConfirm={bulk.onConfirmBulkRestore}
            />
        </div>
    );
}
