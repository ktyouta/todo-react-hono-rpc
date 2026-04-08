import { Button } from "@/components";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Select } from "@/components/ui/select/select";
import type { RoleListReturnType } from "../../api/get-role-list";

type PropsType = {
    isOpen: boolean;
    selectedCount: number;
    isLoading: boolean;
    roleList: RoleListReturnType;
    selectedRoleId: number | null;
    errorMessage: string | null;
    onClose: () => void;
    onSelectRole: (roleId: number | null) => void;
    onConfirm: () => void;
};

export function UserManagementBulkRoleDialog({
    isOpen,
    selectedCount,
    isLoading,
    roleList,
    selectedRoleId,
    errorMessage,
    onClose,
    onSelectRole,
    onConfirm,
}: PropsType) {

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="ロールを一括変更" size="medium">
            <div className="flex flex-col gap-5">
                <p className="text-sm text-gray-700">
                    {selectedCount}件のユーザーのロールを変更します。
                </p>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">変更するロール</label>
                    <Select
                        options={roleList.map((role) => ({
                            value: String(role.id),
                            label: role.name,
                        }))}
                        placeholder="選択してください"
                        value={selectedRoleId ? String(selectedRoleId) : ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            onSelectRole(val ? Number(val) : null);
                        }}
                        className="w-full h-9 px-2 text-sm"
                    />
                </div>
                {errorMessage && (
                    <p className="text-sm text-red-600">{errorMessage}</p>
                )}
                <div className="flex justify-end gap-2">
                    <Button
                        colorType="blue"
                        sizeType="medium"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 h-9 py-0 bg-[#fcfdfd] border border-gray-300 text-sm text-gray-600 hover:bg-gray-200"
                    >
                        キャンセル
                    </Button>
                    <Button
                        colorType="blue"
                        sizeType="medium"
                        onClick={onConfirm}
                        disabled={isLoading || selectedRoleId === null}
                        className="px-4 h-9 py-0 font-medium disabled:opacity-50"
                    >
                        {isLoading ? "変更中..." : "変更する"}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
