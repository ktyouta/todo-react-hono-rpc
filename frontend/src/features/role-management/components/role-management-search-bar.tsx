import { Button, Textbox } from "@/components";
import { HiMagnifyingGlass } from "react-icons/hi2";
import type { RoleManagementSearchFilter } from "../types/role-management-search-filter";

type PropsType = {
    searchCondition: RoleManagementSearchFilter;
    onChange: (searchCondition: RoleManagementSearchFilter) => void;
    onSearch: () => void;
    onClear: () => void;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function RoleManagementSearchBar({ searchCondition, onChange, onSearch, onClear, handleKeyPress }: PropsType) {
    const isEmpty = searchCondition.name === '';

    return (
        <div className="pb-4 border-b border-gray-300 mb-3 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <HiMagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 size-4 pointer-events-none" />
                    <Textbox
                        value={searchCondition.name}
                        onChange={(e) => onChange({ ...searchCondition, name: e.target.value })}
                        className="w-full pl-8 border-[#c0c0c0]"
                        placeholder="ロール名で検索"
                        onKeyDown={handleKeyPress}
                    />
                </div>
                <div className="flex items-center gap-2 shrink-0">
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
        </div>
    );
}
