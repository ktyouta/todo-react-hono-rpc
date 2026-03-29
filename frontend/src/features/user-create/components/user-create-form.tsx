import { Button, LoadingOverlay, Select, Textbox } from "@/components";
import { MONTH_LIST } from "@/constants/date-options";
import { RoleListReturnType } from "@/features/api/get-role-list";
import { getDayList } from "@/utils/date-select-options";
import { BaseSyntheticEvent } from "react";
import { Control, Controller, FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { UserCreateRequestType } from "../types/user-create-request-type";

type PropsType = {
    register: UseFormRegister<UserCreateRequestType>;
    control: Control<UserCreateRequestType>;
    errors: FieldErrors<UserCreateRequestType>;
    clickCreate: (e?: BaseSyntheticEvent) => Promise<void>;
    clickClear: () => void;
    roleList: RoleListReturnType;
    yearComboList: { label: string; value: string }[];
    watch: UseFormWatch<UserCreateRequestType>;
    isLoading: boolean;
};

export function UserCreateForm(props: PropsType) {
    const {
        register,
        control,
        errors,
        clickCreate,
        clickClear,
        roleList,
        yearComboList,
        watch,
        isLoading,
    } = props;

    return (
        <div className="w-full min-h-full">
            <div className="flex items-center pr-[10px]">
                <span className="font-bold text-[18px] sm:text-[22px]">ユーザー作成</span>
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
                <div className="w-full p-3 sm:p-[20px] border border-[#c0c0c0] rounded bg-white flex flex-col gap-5">
                    {/* ユーザー名 */}
                    <div>
                        <label className="block mb-2">
                            ユーザー名（3〜30文字）
                        </label>
                        <Textbox
                            registration={register("name")}
                            className="w-full border-[#c0c0c0]"
                            type="text"
                            maxLength={30}
                            autoComplete="off"
                        />
                        {errors.name?.message && (
                            <p className="text-red-500 pl-1 mt-2">{errors.name.message}</p>
                        )}
                    </div>
                    {/* 生年月日 */}
                    <div>
                        <label className="block mb-2">
                            生年月日
                        </label>
                        <div className="flex items-center gap-2">
                            <Select
                                options={yearComboList}
                                className="flex-1 h-10 px-3 rounded border-[#c0c0c0]"
                                registration={register("birthday.year")}
                            />
                            <span className="text-gray-600 shrink-0">年</span>
                            <Select
                                options={MONTH_LIST}
                                className="flex-1 h-10 px-3 rounded border-[#c0c0c0]"
                                registration={register("birthday.month")}
                            />
                            <span className="text-gray-600 shrink-0">月</span>
                            <Select
                                options={getDayList(watch("birthday.year"), watch("birthday.month"))}
                                className="flex-1 h-10 px-3 rounded border-[#c0c0c0]"
                                registration={register("birthday.day")}
                            />
                            <span className="text-gray-600 shrink-0">日</span>
                        </div>
                        {errors.birthday?.message && (
                            <p className="text-red-500 pl-1 mt-2">{errors.birthday.message}</p>
                        )}
                    </div>
                    {/* ロール */}
                    <div>
                        <label className="block mb-2">
                            ロール
                        </label>
                        <div className="sm:max-w-xs">
                            <Controller
                                name="roleId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={String(field.value)}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        options={roleList.map((r) => ({ value: String(r.id), label: r.name }))}
                                        className="w-full px-3 py-2.5 border-[#c0c0c0]"
                                    />
                                )}
                            />
                        </div>
                        {errors.roleId?.message && (
                            <p className="text-red-500 pl-1 mt-2">{errors.roleId.message}</p>
                        )}
                    </div>
                    {/* パスワード */}
                    <div>
                        <label className="block mb-2">
                            パスワード（8文字以上、半角英数記号）
                        </label>
                        <Textbox
                            registration={register("password")}
                            className="w-full border-[#c0c0c0]"
                            type="password"
                            autoComplete="off"
                        />
                        {errors.password?.message && (
                            <p className="text-red-500 pl-1 mt-2">{errors.password.message}</p>
                        )}
                    </div>
                    {/* 確認用パスワード */}
                    <div>
                        <label className="block mb-2">
                            確認用パスワード
                        </label>
                        <Textbox
                            registration={register("confirmPassword")}
                            className="w-full border-[#c0c0c0]"
                            type="password"
                            autoComplete="off"
                        />
                        {errors.confirmPassword?.message && (
                            <p className="text-red-500 pl-1 mt-2">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>
            </div>
            {isLoading && <LoadingOverlay />}
        </div>
    );
}
