import { LoadingOverlay, Pagination, Table } from "@/components";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { TableProps } from "@/components/ui/table/table";
import { RoleListReturnType } from "@/features/api/get-role-list";
import { HiOutlineUserMinus } from "react-icons/hi2";
import { UserDeletedManagementListReturnType } from "../api/get-user-deleted-management-list";
import { UseUserDeletedManagementBulkReturn } from "../hooks/use-user-deleted-management-bulk";
import { UserDeletedManagementSearchFilter } from "../types/user-deleted-management-search-filter";
import { UserDeletedManagementActionBar } from "./user-deleted-management-action-bar";
import { UserDeletedManagementBulkRestoreDialog } from "./user-deleted-management-bulk-restore-dialog";
import { UserDeletedManagementCard } from "./user-deleted-management-card";
import { UserDeletedManagementSearchBar } from "./user-deleted-management-search-bar";

type PropsType = {
    userData: UserDeletedManagementListReturnType;
    onRowClick: (entry: UserDeletedManagementListReturnType['list'][number]) => void;
    roleList: RoleListReturnType;
    searchCondition: UserDeletedManagementSearchFilter;
    setSearchCondition: (condition: UserDeletedManagementSearchFilter) => void;
    clearSearchCondition: () => void;
    clickSearch: () => void;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    currentPage: number;
    changePage: (page: number) => void;
    isShowOverlay: boolean;
    bulk: UseUserDeletedManagementBulkReturn;
};

export function UserDeletedManagementList(props: PropsType) {

    const {
        userData,
        onRowClick,
        roleList,
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
    const columns: TableProps<UserDeletedManagementListReturnType['list'][number]>['columns'] = [
        ...(bulk.isBulkMode ? [{
            title: '',
            field: 'id' as const,
            className: 'w-[4%] whitespace-nowrap text-center',
            Cell: ({ entry }: { entry: UserDeletedManagementListReturnType['list'][number] }) => (
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
        { title: 'ユーザー名', field: 'name', className: 'max-w-0', Cell: ({ entry }) => <span className="block truncate">{entry.name}</span> },
        { title: 'ロール', field: 'roleName', className: 'w-[12%] whitespace-nowrap' },
        { title: '最終ログイン', field: 'lastLoginDate', className: 'w-[12%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.lastLoginDate?.slice(0, 10) || `—`}</span> },
        { title: '生年月日', field: 'birthday', className: 'w-[12%] whitespace-nowrap', Cell: ({ entry }) => <span>{`${entry.birthday.slice(0, 4)}-${entry.birthday.slice(4, 6)}-${entry.birthday.slice(6, 8)}`}</span> },
        { title: '登録日', field: 'createdAt', className: 'w-[11%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.createdAt.slice(0, 10)}</span> },
        { title: '更新日', field: 'updatedAt', className: 'w-[11%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.updatedAt.slice(0, 10)}</span> },
    ];

    return (
        <div className="w-full min-h-full p-1 sm:p-5 flex flex-col">
            {isShowOverlay && <LoadingOverlay />}

            {/* 検索バー / アクションバー 切替 */}
            {bulk.isBulkMode ? (
                <UserDeletedManagementActionBar
                    selectedCount={bulk.selectedIds.length}
                    isAllSelected={bulk.isAllSelected}
                    onSelectAll={bulk.onSelectAll}
                    onOpenBulkRestoreDialog={bulk.onOpenBulkRestoreDialog}
                    onCancel={bulk.onToggleBulkMode}
                />
            ) : (
                <UserDeletedManagementSearchBar
                    searchCondition={searchCondition}
                    onChange={setSearchCondition}
                    onSearch={clickSearch}
                    onClear={clearSearchCondition}
                    roleList={roleList}
                    handleKeyPress={handleKeyPress}
                    onToggleBulkMode={bulk.onToggleBulkMode}
                />
            )}

            <p className="text-sm text-gray-500 mb-3 text-right pr-2">全 {userData.total} 件</p>
            <div className="flex-1">
                {userData.list.length === 0 ? (
                    <div className="flex h-80 flex-col items-center justify-center gap-3">
                        <HiOutlineUserMinus className="size-12 text-gray-300" />
                        <p className="text-[17px] text-gray-400">削除済みユーザーがありません</p>
                    </div>
                ) : (
                    <>
                        {/* テーブル表示: lg 以上 */}
                        <div className="hidden lg:block border border-gray-200 rounded-md overflow-hidden">
                            <Table
                                data={userData.list}
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
                            {userData.list.map((entry) => (
                                <UserDeletedManagementCard
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
                {userData.totalPages > 1 &&
                    <Pagination
                        currentPage={currentPage}
                        totalPages={userData.totalPages}
                        onPageChange={changePage}
                    />
                }
            </div>

            {/* 一括復元ダイアログ */}
            <UserDeletedManagementBulkRestoreDialog
                isOpen={bulk.isBulkRestoreDialogOpen}
                selectedCount={bulk.selectedIds.length}
                isLoading={bulk.isBulkRestoreLoading}
                onClose={bulk.onCloseBulkRestoreDialog}
                onConfirm={bulk.onConfirmBulkRestore}
            />
        </div>
    );
}
