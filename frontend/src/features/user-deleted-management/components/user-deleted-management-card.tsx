import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { UserDeletedManagementListReturnType } from "../api/get-user-deleted-management-list";

type PropsType = {
    entry: UserDeletedManagementListReturnType['list'][number];
    onClick: () => void;
    isBulkMode?: boolean;
    isSelected?: boolean;
    onSelect?: (checked: boolean) => void;
};

export function UserDeletedManagementCard({ entry, onClick, isBulkMode = false, isSelected = false, onSelect }: PropsType) {
    return (
        <div
            className={`bg-white border rounded-lg p-4 cursor-pointer transition-colors ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                {isBulkMode && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                            checked={isSelected}
                            onChange={(checked) => onSelect?.(checked)}
                            size="medium"
                            className="mt-0.5 shrink-0"
                        />
                    </div>
                )}
                <p className="text-[17px] font-medium text-gray-800 break-words min-w-0 flex-1">{entry.name}</p>
                <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 mt-0.5">#{entry.id}</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 pt-3 border-t border-gray-100 text-xs">
                <div>
                    <span className="text-gray-400">ロール</span>
                    <span className="ml-1.5 text-gray-500">{entry.roleName}</span>
                </div>
                <div>
                    <span className="text-gray-400">生年月日</span>
                    <span className="ml-1.5 text-gray-500">{`${entry.birthday.slice(0, 4)}-${entry.birthday.slice(4, 6)}-${entry.birthday.slice(6, 8)}`}</span>
                </div>
                <div>
                    <span className="text-gray-400">登録日</span>
                    <span className="ml-1.5 text-gray-500">{entry.createdAt.slice(0, 10)}</span>
                </div>
                <div>
                    <span className="text-gray-400">更新日</span>
                    <span className="ml-1.5 text-gray-500">{entry.updatedAt.slice(0, 10)}</span>
                </div>
            </div>
        </div>
    );
}
