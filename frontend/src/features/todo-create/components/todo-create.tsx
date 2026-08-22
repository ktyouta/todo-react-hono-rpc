import { Button, DatePicker, LoadingOverlay, Select, Spinner, Textarea, Textbox } from "@/components";
import { CATEGORY_ID } from "@/constants/master";
import { CategoryReturnType } from "@/features/api/get-category";
import { PriorityReturnType } from "@/features/api/get-priority";
import { StatusReturnType } from "@/features/api/get-status";
import { BaseSyntheticEvent } from "react";
import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import { TodoAssistResponseType } from "../../api/todo-assist";
import { TodoCreateRequestType } from "../types/todo-create-request-type";

type PropsType = {
    register: UseFormRegister<TodoCreateRequestType>;
    control: Control<TodoCreateRequestType>;
    errors: FieldErrors<TodoCreateRequestType>;
    clickCreate: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
    clickClear: () => void;
    statusList: StatusReturnType;
    categoryList: CategoryReturnType;
    priorityList: PriorityReturnType;
    selectedCategoryId: number;
    isLoading: boolean;
    assistResult: TodoAssistResponseType | null;
    isAssistLoading: boolean;
    isAssistEnabled: boolean;
    clickAssist: () => void;
    applyAssist: () => void;
    cancelAssist: () => void;
}

export function TodoCreate(props: PropsType) {

    const {
        register,
        control,
        errors,
        clickCreate,
        clickClear,
        statusList,
        categoryList,
        priorityList,
        selectedCategoryId,
        isLoading,
        assistResult,
        isAssistLoading,
        isAssistEnabled,
        clickAssist,
        applyAssist,
        cancelAssist,
    } = props;

    return (
        <div className="w-full min-h-full">
            <div className="flex items-center pr-[10px]">
                <span className="font-bold text-[18px] sm:text-[22px] dark:text-gray-100">
                    タスク作成
                </span>
                <div className="flex-1" />
                <div className="flex gap-2 sm:gap-3">
                    <Button
                        colorType={"green"}
                        sizeType={"large"}
                        className="px-4 sm:px-6 bg-gray-400 hover:bg-gray-500"
                        onClick={clickClear}
                    >
                        クリア
                    </Button>
                    <Button
                        colorType={"green"}
                        sizeType={"large"}
                        className="px-4 sm:px-10 bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-900 dark:hover:bg-cyan-800"
                        onClick={clickCreate}
                    >
                        作成
                    </Button>
                </div>
            </div>
            <div className="w-full pt-7 sm:pt-[50px] text-[15px]">
                {Object.keys(errors).length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2.5 mb-5 bg-red-50 border border-red-200 rounded text-sm text-red-600 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
                        <span>入力内容にエラーがあります。確認してください。</span>
                    </div>
                )}
                <div className="w-full">
                    <Textbox
                        registration={register("title")}
                        className="w-full border-[#c0c0c0]"
                        placeholder="タイトル"
                    />
                    {errors.title?.message && (
                        <p className="text-red-500 dark:text-red-400 pl-1 mt-2">{errors.title.message}</p>
                    )}
                </div>
                <div className="w-full p-3 sm:p-[20px] border border-[#c0c0c0] dark:border-gray-600 rounded mt-3 sm:mt-[20px] bg-white dark:bg-gray-800">
                    <Textarea
                        registration={register("content")}
                        className="w-full  min-h-[450px] border-[#c0c0c0]"
                    />
                    {errors.content?.message && (
                        <p className="text-red-500 dark:text-red-400 pl-1 mt-2">{errors.content.message}</p>
                    )}
                    <div className="flex justify-end mt-2">
                        <Button
                            colorType="blue"
                            sizeType="medium"
                            onClick={clickAssist}
                            disabled={!isAssistEnabled || isAssistLoading}
                            className="disabled:opacity-70"
                        >
                            {isAssistLoading ? "生成中..." : "AIで整える"}
                        </Button>
                    </div>
                    {assistResult && (
                        <div className={`mt-3 p-3 border border-blue-200 rounded bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20 flex flex-col gap-3 relative transition-opacity duration-200 ${isAssistLoading ? "opacity-60 pointer-events-none" : ""}`}>
                            {isAssistLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Spinner size={28} />
                                </div>
                            )}
                            <p className="text-base font-bold text-blue-600 dark:text-blue-400 mb-2">AI提案</p>
                            <div className="flex flex-col gap-5">
                                {assistResult.canApply ? (
                                    <>
                                        <div>
                                            <span className="text-base text-gray-500 dark:text-gray-400">タイトル</span>
                                            <p className="text-base mt-0.5 dark:text-gray-100">{assistResult.data.title}</p>
                                        </div>
                                        <div>
                                            <span className="text-base text-gray-500 dark:text-gray-400">詳細</span>
                                            <p className="text-base mt-0.5 whitespace-pre-wrap dark:text-gray-100">{assistResult.data.content}</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-base text-gray-600 dark:text-gray-300">{assistResult.data.content}</p>
                                )}
                                <div className="flex justify-end gap-2">
                                    <Button
                                        colorType="green"
                                        sizeType="medium"
                                        className="bg-gray-400 hover:bg-gray-500"
                                        onClick={cancelAssist}
                                    >
                                        キャンセル
                                    </Button>
                                    <Button
                                        colorType="green"
                                        sizeType="medium"
                                        className="bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-900 dark:hover:bg-cyan-800 disabled:opacity-50"
                                        disabled={!assistResult.canApply}
                                        onClick={applyAssist}
                                    >
                                        適用する
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%] mt-[15px] pt-[20px] border-t border-[#e8e8e8] dark:border-gray-700">
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap w-[5em] dark:text-gray-300">カテゴリ</span>
                            <Select
                                registration={register("category", { valueAsNumber: true })}
                                options={categoryList.map((c) => ({ value: String(c.id), label: c.name }))}
                                className="flex-1 border border-[#c0c0c0] rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 text-base focus:outline-none focus:border-[#888]"
                            />
                        </div>
                        {
                            selectedCategoryId !== CATEGORY_ID.MEMO &&
                            <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                                <span className="whitespace-nowrap w-[5em] dark:text-gray-300">ステータス</span>
                                <Select
                                    registration={register("status", { valueAsNumber: true })}
                                    options={statusList.map((s) => ({ value: String(s.id), label: s.name }))}
                                    className="flex-1 border border-[#c0c0c0] rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 text-base focus:outline-none focus:border-[#888]"
                                />
                            </div>
                        }
                    </div>
                    {selectedCategoryId !== CATEGORY_ID.MEMO && (
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%] mt-[25px] pt-[20px] border-t border-[#e8e8e8] dark:border-gray-700">
                            <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                                <span className="whitespace-nowrap w-[5em] dark:text-gray-300">優先度</span>
                                <Select
                                    registration={register("priority", { valueAsNumber: true })}
                                    options={priorityList.map((s) => ({ value: String(s.id), label: s.name }))}
                                    className="flex-1 border border-[#c0c0c0] rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 text-base focus:outline-none focus:border-[#888]"
                                />
                            </div>
                            <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                                <span className="whitespace-nowrap w-[5em] dark:text-gray-300">期限日</span>
                                <Controller
                                    name="dueDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            value={field.value ?? null}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* ローディングオーバーレイ */}
            {isLoading && <LoadingOverlay />}
        </div>
    );
}
