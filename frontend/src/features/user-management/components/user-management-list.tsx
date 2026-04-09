import { LoadingOverlay, Pagination, Table } from "@/components";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import type { TableProps } from "@/components/ui/table/table";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { RoleListReturnType } from "../../api/get-role-list";
import type { UserManagementListReturnType } from "../api/get-user-management-list";
import type { UseUserManagementBulkReturn } from "../hooks/use-user-management-bulk";
import type { UserManagementSearchFilter } from "../types/user-management-search-filter";
import { UserManagementActionBar } from "./user-management-action-bar";
import { UserManagementBulkDeleteDialog } from "./user-management-bulk-delete-dialog";
import { UserManagementBulkRoleDialog } from "./user-management-bulk-role-dialog";
import { UserManagementCard } from "./user-management-card";
import { UserManagementSearchBar } from "./user-management-search-bar";

type PropsType = {
    userData: UserManagementListReturnType;
    onRowClick: (entry: UserManagementListReturnType['list'][number]) => void;
    searchCondition: UserManagementSearchFilter;
    setSearchCondition: (condition: UserManagementSearchFilter) => void;
    clearSearchCondition: () => void;
    clickSearch: () => void;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    currentPage: number;
    changePage: (page: number) => void;
    isShowOverlay: boolean;
    roleList: RoleListReturnType;
    bulk: UseUserManagementBulkReturn;
};

// テーブルカラム（通常モード）
const baseColumns: TableProps<UserManagementListReturnType['list'][number]>['columns'] = [
    { title: 'ID', field: 'id', className: 'w-[5%] whitespace-nowrap pl-4' },
    { title: 'ユーザー名', field: 'name', className: 'max-w-0', Cell: ({ entry }) => <span className="block truncate">{entry.name}</span> },
    { title: '生年月日', field: 'birthday', className: 'w-[12%] whitespace-nowrap', Cell: ({ entry }) => <span>{`${entry.birthday.slice(0, 4)}-${entry.birthday.slice(4, 6)}-${entry.birthday.slice(6, 8)}`}</span> },
    { title: 'ロール', field: 'roleName', className: 'w-[10%] whitespace-nowrap' },
    { title: '登録日', field: 'createdAt', className: 'w-[12%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.createdAt.slice(0, 10)}</span> },
    { title: '更新日', field: 'updatedAt', className: 'w-[12%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.updatedAt.slice(0, 10)}</span> },
];

export function UserManagementList(props: PropsType) {
    const {
        userData,
        onRowClick,
        searchCondition,
        setSearchCondition,
        clearSearchCondition,
        clickSearch,
        handleKeyPress,
        currentPage,
        changePage,
        isShowOverlay,
        roleList,
        bulk,
    } = props;

    // テーブルカラム（一括操作モード時はチェックボックス列を先頭に追加）
    const columns: TableProps<UserManagementListReturnType['list'][number]>['columns'] = [
        ...(bulk.isBulkMode ? [{
            title: '',
            field: 'id' as const,
            className: 'w-[4%] whitespace-nowrap text-center',
            Cell: ({ entry }: { entry: UserManagementListReturnType['list'][number] }) => (
                <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                        checked={bulk.selectedIds.includes(entry.id)}
                        onChange={(checked) => bulk.onSelectItem(entry.id, checked)}
                        disabled={bulk.isDisabled(entry.id)}
                        size="medium"
                    />
                </div>
            ),
        }] : []),
        ...baseColumns,
    ];

    return (
        <div className="w-full min-h-full p-1 sm:p-5 flex flex-col">
            {isShowOverlay && <LoadingOverlay />}

            {/* 検索バー / アクションバー 切替 */}
            {bulk.isBulkMode ? (
                <UserManagementActionBar
                    selectedCount={bulk.selectedIds.length}
                    isAllSelected={bulk.isAllSelected}
                    onSelectAll={bulk.onSelectAll}
                    onOpenBulkRoleDialog={bulk.onOpenBulkRoleDialog}
                    onOpenBulkDeleteDialog={bulk.onOpenBulkDeleteDialog}
                    onCancel={bulk.onToggleBulkMode}
                />
            ) : (
                <UserManagementSearchBar
                    searchCondition={searchCondition}
                    onChange={setSearchCondition}
                    onSearch={clickSearch}
                    onClear={clearSearchCondition}
                    handleKeyPress={handleKeyPress}
                    roleList={roleList}
                    onToggleBulkMode={bulk.onToggleBulkMode}
                />
            )}

            <p className="text-sm text-gray-500 mb-3 text-right pr-2">全 {userData.total} 件</p>
            <div className="flex-1">
                {userData.list.length === 0 ? (
                    <div className="flex h-80 flex-col items-center justify-center gap-3">
                        <HiOutlineUserGroup className="size-12 text-gray-300" />
                        <p className="text-[17px] text-gray-400">ユーザーがいません</p>
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
                                    ? (entry) => {
                                        if (!bulk.isDisabled(entry.id)) {
                                            bulk.onSelectItem(entry.id, !bulk.selectedIds.includes(entry.id));
                                        }
                                    }
                                    : onRowClick
                                }
                            />
                        </div>
                        {/* カード表示: lg 未満 */}
                        <div className="lg:hidden flex flex-col gap-3">
                            {userData.list.map((entry) => (
                                <UserManagementCard
                                    key={entry.id}
                                    entry={entry}
                                    onClick={() => bulk.isBulkMode
                                        ? (!bulk.isDisabled(entry.id) && bulk.onSelectItem(entry.id, !bulk.selectedIds.includes(entry.id)))
                                        : onRowClick(entry)
                                    }
                                    isBulkMode={bulk.isBulkMode}
                                    isSelected={bulk.selectedIds.includes(entry.id)}
                                    isDisabled={bulk.isDisabled(entry.id)}
                                    onSelect={(checked) => bulk.onSelectItem(entry.id, checked)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="mt-auto pt-4">
                {userData.totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={userData.totalPages}
                        onPageChange={changePage}
                    />
                )}
            </div>

            {/* 一括ロール変更ダイアログ */}
            <UserManagementBulkRoleDialog
                isOpen={bulk.isBulkRoleDialogOpen}
                selectedCount={bulk.selectedIds.length}
                isLoading={bulk.isBulkRoleLoading}
                roleList={roleList}
                selectedRoleId={bulk.selectedRoleId}
                errorMessage={bulk.bulkRoleErrorMessage}
                onClose={bulk.onCloseBulkRoleDialog}
                onSelectRole={bulk.onSelectRole}
                onConfirm={bulk.onConfirmBulkRole}
            />

            {/* 一括削除ダイアログ */}
            <UserManagementBulkDeleteDialog
                isOpen={bulk.isBulkDeleteDialogOpen}
                selectedCount={bulk.selectedIds.length}
                isLoading={bulk.isBulkDeleteLoading}
                onClose={bulk.onCloseBulkDeleteDialog}
                onConfirm={bulk.onConfirmBulkDelete}
            />
        </div>
    );
}
