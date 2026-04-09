import { LoadingOverlay, Pagination, Table } from "@/components";
import type { TableProps } from "@/components/ui/table/table";
import { HiOutlineKey } from "react-icons/hi2";
import type { RoleManagementListReturnType } from "../api/get-role-management-list";
import type { RoleManagementSearchFilter } from "../types/role-management-search-filter";
import { RoleManagementCard } from "./role-management-card";
import { RoleManagementSearchBar } from "./role-management-search-bar";

type PropsType = {
    roleData: RoleManagementListReturnType;
    onRowClick: (entry: RoleManagementListReturnType['list'][number]) => void;
    searchCondition: RoleManagementSearchFilter;
    setSearchCondition: (condition: RoleManagementSearchFilter) => void;
    clearSearchCondition: () => void;
    clickSearch: () => void;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    currentPage: number;
    changePage: (page: number) => void;
    isShowOverlay: boolean;
};

const columns: TableProps<RoleManagementListReturnType['list'][number]>['columns'] = [
    { title: 'ID', field: 'id', className: 'w-[5%] whitespace-nowrap pl-4' },
    { title: 'ロール名', field: 'name', className: 'max-w-0', Cell: ({ entry }) => <span className="block truncate">{entry.name}</span> },
    { title: '登録日', field: 'createdAt', className: 'w-[15%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.createdAt.slice(0, 10)}</span> },
    { title: '更新日', field: 'updatedAt', className: 'w-[15%] whitespace-nowrap hidden md:table-cell', Cell: ({ entry }) => <span>{entry.updatedAt.slice(0, 10)}</span> },
];

export function RoleManagementList(props: PropsType) {
    const {
        roleData,
        onRowClick,
        searchCondition,
        setSearchCondition,
        clearSearchCondition,
        clickSearch,
        handleKeyPress,
        currentPage,
        changePage,
        isShowOverlay,
    } = props;

    return (
        <div className="w-full min-h-full p-1 sm:p-5 flex flex-col">
            {isShowOverlay && <LoadingOverlay />}
            <RoleManagementSearchBar
                searchCondition={searchCondition}
                onChange={setSearchCondition}
                onSearch={clickSearch}
                onClear={clearSearchCondition}
                handleKeyPress={handleKeyPress}
            />
            <p className="text-sm text-gray-500 mb-3 text-right pr-2">全 {roleData.total} 件</p>
            <div className="flex-1">
                {roleData.list.length === 0 ? (
                    <div className="flex h-80 flex-col items-center justify-center gap-3">
                        <HiOutlineKey className="size-12 text-gray-300" />
                        <p className="text-[17px] text-gray-400">ロールがありません</p>
                    </div>
                ) : (
                    <>
                        {/* テーブル表示: lg 以上 */}
                        <div className="hidden lg:block border border-gray-200 rounded-md overflow-hidden">
                            <Table
                                data={roleData.list}
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
                            {roleData.list.map((entry) => (
                                <RoleManagementCard
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
                {roleData.totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={roleData.totalPages}
                        onPageChange={changePage}
                    />
                )}
            </div>
        </div>
    );
}
