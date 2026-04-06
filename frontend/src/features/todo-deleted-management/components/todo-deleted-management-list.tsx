import { LoadingOverlay, Pagination, Table } from "@/components";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { TableProps } from "@/components/ui/table/table";
import { CategoryReturnType } from "@/features/api/get-category";
import { PriorityReturnType } from "@/features/api/get-priority";
import { StatusReturnType } from "@/features/api/get-status";
import { UserManagementListReturnType } from "@/features/api/get-user-list";
import { getDueDateStatus } from "@/features/todo/utils/due-date-status";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { TodoDeletedManagementListReturnType } from "../api/get-todo-deleted-management-list";
import { UseTodoDeletedManagementBulkReturn } from "../hooks/use-todo-deleted-management-bulk";
import { TodoDeletedManagementSearchFilter } from "../types/todo-deleted-management-search-filter";
import { TodoDeletedManagementActionBar } from "./todo-deleted-management-action-bar";
import { TodoDeletedManagementBulkRestoreDialog } from "./todo-deleted-management-bulk-restore-dialog";
import { TodoDeletedManagementCard } from "./todo-deleted-management-card";
import { TodoDeletedManagementSearchBar } from "./todo-deleted-management-search-bar";

type PropsType = {
    taskData: TodoDeletedManagementListReturnType;
    onRowClick: (entry: TodoDeletedManagementListReturnType['list'][number]) => void;
    userList: UserManagementListReturnType;
    categoryList: CategoryReturnType;
    statusList: StatusReturnType;
    priorityList: PriorityReturnType;
    searchCondition: TodoDeletedManagementSearchFilter;
    setSearchCondition: (condition: TodoDeletedManagementSearchFilter) => void;
    clearSearchCondition: () => void;
    clickSearch: () => void;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    currentPage: number;
    changePage: (page: number) => void;
    isShowOverlay: boolean;
    bulk: UseTodoDeletedManagementBulkReturn;
};

export function TodoDeletedManagementList(props: PropsType) {

    const {
        taskData,
        onRowClick,
        userList,
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
    const columns: TableProps<TodoDeletedManagementListReturnType['list'][number]>['columns'] = [
        ...(bulk.isBulkMode ? [{
            title: '',
            field: 'id' as const,
            className: 'w-[4%] whitespace-nowrap text-center',
            Cell: ({ entry }: { entry: TodoDeletedManagementListReturnType['list'][number] }) => (
                <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                        checked={bulk.selectedIds.includes(entry.id)}
                        onChange={(checked) => bulk.onSelectItem(entry.id, checked)}
                        size="medium"
                    />
                </div>
            ),
        }] : []),
        { title: 'ID', field: 'id', className: 'w-[5%] whitespace-nowrap' },
        { title: 'タイトル', field: 'title', className: 'max-w-0', Cell: ({ entry }) => <span className="block truncate">{entry.title}</span> },
        { title: 'ユーザー', field: 'userName', className: 'w-[10%] whitespace-nowrap' },
        { title: 'カテゴリ', field: 'categoryName', className: 'w-[9%] whitespace-nowrap' },
        { title: 'ステータス', field: 'statusName', className: 'w-[10%] whitespace-nowrap' },
        { title: '優先度', field: 'priorityName', className: 'w-[8%] whitespace-nowrap' },
        {
            title: '期限日', field: 'dueDate', className: 'w-[10%] whitespace-nowrap', Cell: ({ entry }) => {
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
        { title: '登録日', field: 'createdAt', className: 'w-[10%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.createdAt.slice(0, 10)}</span> },
        { title: '更新日', field: 'updatedAt', className: 'w-[10%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.updatedAt.slice(0, 10)}</span> },
    ];

    return (
        <div className="w-full min-h-full p-1 sm:p-5 flex flex-col">
            {isShowOverlay && <LoadingOverlay />}

            {/* 検索バー / アクションバー 切替 */}
            {bulk.isBulkMode ? (
                <TodoDeletedManagementActionBar
                    selectedCount={bulk.selectedIds.length}
                    isAllSelected={bulk.isAllSelected}
                    onSelectAll={bulk.onSelectAll}
                    onOpenBulkRestoreDialog={bulk.onOpenBulkRestoreDialog}
                    onCancel={bulk.onToggleBulkMode}
                />
            ) : (
                <TodoDeletedManagementSearchBar
                    searchCondition={searchCondition}
                    onChange={setSearchCondition}
                    onSearch={clickSearch}
                    onClear={clearSearchCondition}
                    userList={userList}
                    categoryList={categoryList}
                    statusList={statusList}
                    priorityList={priorityList}
                    handleKeyPress={handleKeyPress}
                    onToggleBulkMode={bulk.onToggleBulkMode}
                />
            )}

            <p className="text-sm text-gray-500 mb-3 text-right">全 {taskData.total} 件</p>
            <div className="flex-1">
                {taskData.list.length === 0 ? (
                    <div className="flex h-80 flex-col items-center justify-center gap-3">
                        <HiOutlineArchiveBoxXMark className="size-12 text-gray-300" />
                        <p className="text-[17px] text-gray-400">削除済みタスクがありません</p>
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
                                onRowClick={bulk.isBulkMode
                                    ? (entry) => bulk.onSelectItem(entry.id, !bulk.selectedIds.includes(entry.id))
                                    : onRowClick
                                }
                            />
                        </div>
                        {/* カード表示: lg 未満 */}
                        <div className="lg:hidden flex flex-col gap-3">
                            {taskData.list.map((entry) => (
                                <TodoDeletedManagementCard
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
            <TodoDeletedManagementBulkRestoreDialog
                isOpen={bulk.isBulkRestoreDialogOpen}
                selectedCount={bulk.selectedIds.length}
                isLoading={bulk.isBulkRestoreLoading}
                onClose={bulk.onCloseBulkRestoreDialog}
                onConfirm={bulk.onConfirmBulkRestore}
            />
        </div>
    );
}
