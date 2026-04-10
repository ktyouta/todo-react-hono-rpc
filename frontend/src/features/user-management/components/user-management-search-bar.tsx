import { Button, DatePicker, Select, Textbox } from "@/components";
import { RoleListReturnType } from "@/features/api/get-role-list";
import { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { MdFilterAlt } from "react-icons/md";
import { UserManagementSearchFilter } from "../types/user-management-search-filter";

type PropsType = {
    searchCondition: UserManagementSearchFilter;
    onChange: (searchCondition: UserManagementSearchFilter) => void;
    onSearch: () => void;
    onClear: () => void;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    roleList: RoleListReturnType;
    onToggleBulkMode: () => void;
};

const LABEL_CLASS = "text-sm text-gray-500 whitespace-nowrap w-[5em]";
const SELECT_CLASS = "flex-1 px-3 py-2 text-base bg-white border-[#c0c0c0]";


export function UserManagementSearchBar({ searchCondition, onChange, onSearch, onClear, handleKeyPress, roleList, onToggleBulkMode }: PropsType) {
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const activeCount = [
        searchCondition.roleId !== '',
        searchCondition.createdAtFrom !== null || searchCondition.createdAtTo !== null,
        searchCondition.updatedAtFrom !== null || searchCondition.updatedAtTo !== null,
    ].filter(Boolean).length;
    const isEmpty = searchCondition.name === '' && activeCount === 0;

    return (
        <div className="pb-4 border-b border-gray-300 mb-3 sm:mb-6">
            {/* 常時表示エリア */}
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <HiMagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 size-4 pointer-events-none" />
                    <Textbox
                        value={searchCondition.name}
                        onChange={(e) => onChange({ ...searchCondition, name: e.target.value })}
                        className="w-full pl-8 border-[#c0c0c0]"
                        placeholder="ユーザー名で検索"
                        onKeyDown={handleKeyPress}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={() => setIsDetailOpen(!isDetailOpen)}
                        className="relative flex items-center justify-center h-9 w-9 rounded border border-gray-300 bg-[#fcfdfd] hover:bg-gray-200 shrink-0"
                    >
                        <MdFilterAlt className={`size-5 ${isDetailOpen || activeCount > 0 ? 'text-blue-500' : 'text-gray-500'}`} />
                        {activeCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-medium leading-none">
                                {activeCount}
                            </span>
                        )}
                    </button>
                    <Button
                        colorType="blue"
                        sizeType="small"
                        onClick={onClear}
                        disabled={isEmpty}
                        className="px-3 h-9 py-0 bg-[#fcfdfd] border border-gray-300 text-sm text-gray-600 hover:bg-gray-200 whitespace-nowrap disabled:opacity-70 disabled:hover:bg-[#fcfdfd]"
                    >
                        クリア
                    </Button>
                    <Button
                        colorType="blue"
                        sizeType="medium"
                        onClick={onSearch}
                        className="h-9 py-0 font-medium whitespace-nowrap"
                    >
                        検索
                    </Button>
                    <Button
                        colorType="green"
                        sizeType="medium"
                        onClick={onToggleBulkMode}
                        className="px-3 h-9 py-0 bg-teal-500 hover:bg-teal-600 text-white font-medium whitespace-nowrap"
                    >
                        一括操作
                    </Button>
                </div>
            </div>

            {/* 詳細フィルターパネル */}
            {isDetailOpen && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                            <span className={LABEL_CLASS}>ロール</span>
                            <Select
                                value={searchCondition.roleId}
                                onChange={(e) => onChange({ ...searchCondition, roleId: e.target.value })}
                                options={[
                                    { value: '', label: 'すべて' },
                                    ...roleList.map((u) => ({ value: String(u.id), label: u.name })),
                                ]}
                                className={SELECT_CLASS}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <span className={LABEL_CLASS}>登録日</span>
                            <DatePicker
                                value={searchCondition.createdAtFrom}
                                onChange={(d) => onChange({ ...searchCondition, createdAtFrom: d })}
                                placeholder="開始日"
                            />
                            <span className="text-gray-400 text-sm shrink-0">〜</span>
                            <DatePicker
                                value={searchCondition.createdAtTo}
                                onChange={(d) => onChange({ ...searchCondition, createdAtTo: d })}
                                placeholder="終了日"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={LABEL_CLASS}>更新日</span>
                            <DatePicker
                                value={searchCondition.updatedAtFrom}
                                onChange={(d) => onChange({ ...searchCondition, updatedAtFrom: d })}
                                placeholder="開始日"
                            />
                            <span className="text-gray-400 text-sm shrink-0">〜</span>
                            <DatePicker
                                value={searchCondition.updatedAtTo}
                                onChange={(d) => onChange({ ...searchCondition, updatedAtTo: d })}
                                placeholder="終了日"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
