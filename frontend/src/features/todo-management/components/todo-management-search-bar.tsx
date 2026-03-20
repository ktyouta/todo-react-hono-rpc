import { Button, DatePicker, Select, Textbox } from "@/components";
import { CategoryReturnType } from "@/features/api/get-category";
import { PriorityReturnType } from "@/features/api/get-priority";
import { StatusReturnType } from "@/features/api/get-status";
import { UserManagementListReturnType } from "@/features/api/get-user-management-list";
import { useState } from "react";
import { HiChevronDown, HiChevronUp, HiMagnifyingGlass } from "react-icons/hi2";
import { TodoManagementSearchFilter } from "../types/todo-management-search-filter";

type PropsType = {
    searchCondition: TodoManagementSearchFilter;
    onChange: (searchCondition: TodoManagementSearchFilter) => void;
    onSearch: () => void;
    onClear: () => void;
    userList: UserManagementListReturnType['list'];
    categoryList: CategoryReturnType;
    statusList: StatusReturnType;
    priorityList: PriorityReturnType;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const LABEL_CLASS = "text-sm text-gray-500 whitespace-nowrap w-[5em]";
const SELECT_CLASS = "flex-1 px-3 py-2 text-base bg-white border-[#c0c0c0]";

export function TodoManagementSearchBar({ searchCondition, onChange, onSearch, onClear, userList, categoryList, statusList, priorityList, handleKeyPress }: PropsType) {

    // 詳細フィルター開閉フラグ
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const activeCount = [
        searchCondition.userId !== '',
        searchCondition.categoryId !== '',
        searchCondition.statusId !== '',
        searchCondition.priorityId !== '',
        searchCondition.dueDateFrom !== null || searchCondition.dueDateTo !== null,
        searchCondition.createdAtFrom !== null || searchCondition.createdAtTo !== null,
        searchCondition.updatedAtFrom !== null || searchCondition.updatedAtTo !== null,
    ].filter(Boolean).length;
    const isEmpty = searchCondition.title === '' && activeCount === 0;

    return (
        <div className="pb-4 border-b border-gray-300 mb-3 sm:mb-6">
            {/* 常時表示エリア */}
            <div className="flex flex-col sm:flex-row gap-2">
                {/* タイトル検索 */}
                <div className="relative flex-1">
                    <HiMagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 size-4 pointer-events-none" />
                    <Textbox
                        value={searchCondition.title}
                        onChange={(e) => onChange({ ...searchCondition, title: e.target.value })}
                        className="w-full pl-8 border-[#c0c0c0]"
                        placeholder="タイトルで検索"
                        onKeyDown={handleKeyPress}
                    />
                </div>
                {/* 詳細フィルターボタン + バッジ + クリア + 検索 */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button
                        colorType="blue"
                        sizeType="small"
                        onClick={() => setIsDetailOpen(!isDetailOpen)}
                        className="flex items-center gap-1.5 px-3 h-9 py-0 bg-[#fcfdfd] border border-gray-300 text-sm text-gray-600 hover:bg-gray-200 whitespace-nowrap"
                    >
                        <span>詳細フィルター</span>
                        {isDetailOpen
                            ? <HiChevronUp className="size-4" />
                            : <HiChevronDown className="size-4" />
                        }
                    </Button>
                    {activeCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-medium shrink-0 leading-none">
                            {activeCount}
                        </span>
                    )}
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
                </div>
            </div>

            {/* 詳細フィルターパネル */}
            {isDetailOpen && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-3">
                    {/* セレクト（ユーザー・カテゴリ・ステータス・優先度） */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="flex items-center gap-2">
                            <span className={LABEL_CLASS}>ユーザー</span>
                            <Select
                                value={searchCondition.userId}
                                onChange={(e) => onChange({ ...searchCondition, userId: e.target.value })}
                                options={[
                                    { value: '', label: 'すべて' },
                                    ...userList.map((u) => ({ value: String(u.id), label: u.name })),
                                ]}
                                className={SELECT_CLASS}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={LABEL_CLASS}>カテゴリ</span>
                            <Select
                                value={searchCondition.categoryId}
                                onChange={(e) => onChange({ ...searchCondition, categoryId: e.target.value })}
                                options={[
                                    { value: '', label: 'すべて' },
                                    ...categoryList.map((c) => ({ value: String(c.id), label: c.name })),
                                ]}
                                className={SELECT_CLASS}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={LABEL_CLASS}>ステータス</span>
                            <Select
                                value={searchCondition.statusId}
                                onChange={(e) => onChange({ ...searchCondition, statusId: e.target.value })}
                                options={[
                                    { value: '', label: 'すべて' },
                                    ...statusList.map((s) => ({ value: String(s.id), label: s.name })),
                                ]}
                                className={SELECT_CLASS}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={LABEL_CLASS}>優先度</span>
                            <Select
                                value={searchCondition.priorityId}
                                onChange={(e) => onChange({ ...searchCondition, priorityId: e.target.value })}
                                options={[
                                    { value: '', label: 'すべて' },
                                    ...priorityList.map((p) => ({ value: String(p.id), label: p.name })),
                                ]}
                                className={SELECT_CLASS}
                            />
                        </div>
                    </div>
                    {/* 日付範囲 */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <span className={LABEL_CLASS}>期限日</span>
                            <DatePicker
                                value={searchCondition.dueDateFrom}
                                onChange={(d) => onChange({ ...searchCondition, dueDateFrom: d })}
                                placeholder="開始日"
                            />
                            <span className="text-gray-400 text-sm shrink-0">〜</span>
                            <DatePicker
                                value={searchCondition.dueDateTo}
                                onChange={(d) => onChange({ ...searchCondition, dueDateTo: d })}
                                placeholder="終了日"
                            />
                        </div>
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
