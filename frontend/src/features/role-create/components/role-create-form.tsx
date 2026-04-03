import { Button, LoadingOverlay, Textbox } from "@/components";
import type { PermissionListReturnType } from "@/features/api/get-permission-list";
import type { BaseSyntheticEvent } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { RoleCreateRequestType } from "../types/role-create-request-type";

type PropsType = {
    register: UseFormRegister<RoleCreateRequestType>;
    errors: FieldErrors<RoleCreateRequestType>;
    clickCreate: (e?: BaseSyntheticEvent) => Promise<void>;
    clickClear: () => void;
    permissionList: PermissionListReturnType;
    selectedPermissionIds: number[];
    togglePermission: (permissionId: number) => void;
    isLoading: boolean;
};

export function RoleCreateForm(props: PropsType) {
    const {
        register,
        errors,
        clickCreate,
        clickClear,
        permissionList,
        selectedPermissionIds,
        togglePermission,
        isLoading,
    } = props;

    return (
        <div className="w-full min-h-full">
            <div className="flex items-center pr-[10px]">
                <span className="font-bold text-[18px] sm:text-[22px]">ロール作成</span>
                <div className="flex-1" />
                <div className="flex gap-2 sm:gap-3">
                    <Button
                        colorType="green"
                        sizeType="large"
                        className="px-4 sm:px-6 bg-gray-400 hover:bg-gray-500"
                        onClick={clickClear}
                    >
                        クリア
                    </Button>
                    <Button
                        colorType="green"
                        sizeType="large"
                        className="px-4 sm:px-10 bg-cyan-500 hover:bg-cyan-600"
                        onClick={clickCreate}
                    >
                        作成
                    </Button>
                </div>
            </div>
            <div className="w-full pt-7 sm:pt-[50px] text-[15px]">
                {Object.keys(errors).length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2.5 mb-5 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                        <span>入力内容にエラーがあります。確認してください。</span>
                    </div>
                )}
                <div className="w-full p-3 sm:p-[20px] border border-[#c0c0c0] rounded bg-white flex flex-col gap-8">
                    {/* ロール名 */}
                    <div>
                        <label className="block mb-2">
                            ロール名（1〜50文字）
                        </label>
                        <Textbox
                            registration={register("name")}
                            className="w-full border-[#c0c0c0]"
                            type="text"
                            maxLength={50}
                            autoComplete="off"
                        />
                        {errors.name?.message && (
                            <p className="text-red-500 pl-1 mt-2">{errors.name.message}</p>
                        )}
                    </div>
                    {/* パーミッション */}
                    <div>
                        <label className="block mb-2">
                            パーミッション
                        </label>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-5">
                            {permissionList.map((permission) => {
                                const isChecked = selectedPermissionIds.includes(permission.permissionId);
                                return (
                                    <label
                                        key={permission.permissionId}
                                        className={`flex items-center gap-2 px-3 py-2.5 border rounded cursor-pointer transition-colors ${isChecked
                                            ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                                            : "border-[#c0c0c0] bg-white hover:bg-gray-50"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 accent-cyan-500 shrink-0"
                                            checked={isChecked}
                                            onChange={() => togglePermission(permission.permissionId)}
                                        />
                                        <span className="text-sm break-words min-w-0">{permission.screenName}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && <LoadingOverlay />}
        </div>
    );
}
