import { Breadcrumb, Button, DatePicker, Dialog, LoadingOverlay, Select, Spinner, Textarea, Textbox } from "@/components";
import { paths } from "@/config/paths";
import { CATEGORY_ID } from "@/constants/master";
import { CategoryReturnType } from "@/features/api/get-category";
import { PriorityReturnType } from "@/features/api/get-priority";
import { StatusReturnType } from "@/features/api/get-status";
import { TodoAssistResponseType } from "@/features/api/todo-assist";
import { getFormatDatetime } from "@/utils/date-util";
import { BaseSyntheticEvent } from "react";
import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import { HiArrowLeft, HiPencil } from "react-icons/hi2";
import { TaskManagementReturnType } from "../api/get-todo-management";
import { TodoManagementDetailEditType } from "../types/todo-management-detail-edit-type";

type PropsType = {
    task: TaskManagementReturnType;
    statusList: StatusReturnType;
    categoryList: CategoryReturnType;
    priorityList: PriorityReturnType;
    onClickBack: () => void;
    onClickCancel: () => void;
    clickSave: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
    register: UseFormRegister<TodoManagementDetailEditType>;
    control: Control<TodoManagementDetailEditType>;
    errors: FieldErrors<TodoManagementDetailEditType>;
    selectedCategoryId: number;
    isLoading: boolean;
    isSaveDialogOpen: boolean;
    onCancelSave: () => void;
    onConfirmSave: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
    assistResult: TodoAssistResponseType | null;
    isAssistLoading: boolean;
    isAssistEnabled: boolean;
    clickAssist: () => void;
    applyAssist: () => void;
    cancelAssist: () => void;
}

export function TodoManagementDetailEdit(props: PropsType) {

    const {
        task,
        statusList,
        categoryList,
        priorityList,
        onClickBack,
        onClickCancel,
        clickSave,
        register,
        control,
        errors,
        selectedCategoryId,
        isLoading,
        isSaveDialogOpen,
        onCancelSave,
        onConfirmSave,
        assistResult,
        isAssistLoading,
        isAssistEnabled,
        clickAssist,
        applyAssist,
        cancelAssist,
    } = props;

    return (
        <div className="w-full min-h-full flex flex-col pb-4">
            {/* ナビゲーション */}
            <div className="flex items-center mb-5">
                {task.parentId ? (
                    <Breadcrumb
                        items={[
                            { label: "タスク管理", href: paths.todoManagement.path },
                            ...task.ancestors.map((a) => ({
                                label: a.title,
                                href: paths.todoManagementDetail.getHref(a.id),
                            })),
                        ]}
                    />
                ) : (
                    <button
                        type="button"
                        onClick={onClickBack}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                    >
                        <HiArrowLeft />
                        <span>一覧に戻る</span>
                    </button>
                )}
                <div className="flex-1" />
                <div className="flex gap-2 sm:hidden">
                    <Button
                        colorType={"red"}
                        sizeType={"large"}
                        className="px-4"
                        onClick={onClickCancel}
                    >
                        キャンセル
                    </Button>
                    <Button
                        colorType={"green"}
                        sizeType={"large"}
                        className="px-4 bg-cyan-500 hover:bg-cyan-600"
                        onClick={clickSave}
                    >
                        保存
                    </Button>
                </div>
            </div>

            {/* ヘッダー */}
            <div className="hidden sm:flex items-center pr-[10px]">
                <span className="flex items-center gap-1 text-sm text-gray-400">
                    <HiPencil className="size-4" />
                    編集中
                </span>
                <div className="flex-1" />
                <div className="flex gap-2">
                    <Button
                        colorType={"red"}
                        sizeType={"large"}
                        className="px-10"
                        onClick={onClickCancel}
                    >
                        キャンセル
                    </Button>
                    <Button
                        colorType={"green"}
                        sizeType={"large"}
                        className="px-10 bg-cyan-500 hover:bg-cyan-600"
                        onClick={clickSave}
                    >
                        保存
                    </Button>
                </div>
            </div>

            {/* コンテンツ */}
            <div className="w-full pt-7 sm:pt-[30px] text-[15px] flex-1">
                {Object.keys(errors).length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2.5 mb-5 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                        <span>入力内容にエラーがあります。確認してください。</span>
                    </div>
                )}
                <div className="w-full">
                    <Textbox
                        registration={register("title")}
                        className="w-full border-[#c0c0c0] text-base sm:text-[17px] sm:py-2 sm:h-auto"
                        placeholder="タイトル"
                    />
                    {errors.title?.message && (
                        <p className="text-red-500 pl-1 mt-2">{errors.title.message}</p>
                    )}
                </div>
                <div className="w-full p-3 sm:p-[20px] border border-[#c0c0c0] rounded mt-3 sm:mt-[20px] bg-white">
                    <Textarea
                        registration={register("content")}
                        className="w-full min-h-[450px] border-[#c0c0c0] text-base sm:text-[17px]"
                    />
                    {errors.content?.message && (
                        <p className="text-red-500 pl-1 mt-2">{errors.content.message}</p>
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
                        <div className={`mt-3 p-3 border border-blue-200 rounded bg-blue-50 flex flex-col gap-3 relative transition-opacity duration-200 ${isAssistLoading ? "opacity-60 pointer-events-none" : ""}`}>
                            {isAssistLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Spinner size={28} />
                                </div>
                            )}
                            <p className="text-base font-bold text-blue-600 mb-2">AI提案</p>
                            <div className="flex flex-col gap-5">
                                {assistResult.canApply ? (
                                    <>
                                        <div>
                                            <span className="text-base text-gray-500">タイトル</span>
                                            <p className="text-base mt-0.5">{assistResult.data.title}</p>
                                        </div>
                                        <div>
                                            <span className="text-base text-gray-500">詳細</span>
                                            <p className="text-base mt-0.5 whitespace-pre-wrap">{assistResult.data.content}</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-base text-gray-600">{assistResult.data.content}</p>
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
                                        className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50"
                                        disabled={!assistResult.canApply}
                                        onClick={applyAssist}
                                    >
                                        適用する
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%] pt-[20px] mt-[15px] border-t border-[#e8e8e8]">
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">ユーザー</span>
                            <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-base text-gray-700">
                                {task.userName}
                            </span>
                        </div>
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">カテゴリ</span>
                            <Select
                                registration={register("category", { valueAsNumber: true })}
                                options={categoryList.map((c) => ({ value: String(c.id), label: c.name }))}
                                className="flex-1 border border-[#c0c0c0] rounded px-3 py-2 bg-white text-base focus:outline-none focus:border-[#888]"
                            />
                        </div>
                    </div>
                    {selectedCategoryId !== CATEGORY_ID.MEMO && (
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%] pt-[20px] mt-[25px] border-t border-[#e8e8e8]">
                            <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                                <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">ステータス</span>
                                <Select
                                    registration={register("status", { valueAsNumber: true })}
                                    options={statusList.map((s) => ({ value: String(s.id), label: s.name }))}
                                    className="flex-1 border border-[#c0c0c0] rounded px-3 py-2 bg-white text-base focus:outline-none focus:border-[#888]"
                                />
                            </div>
                        </div>
                    )}
                    {selectedCategoryId !== CATEGORY_ID.MEMO && (
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%] pt-[20px] mt-[25px] border-t border-[#e8e8e8]">
                            <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                                <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">優先度</span>
                                <Select
                                    registration={register("priority", { valueAsNumber: true })}
                                    options={priorityList.map((s) => ({ value: String(s.id), label: s.name }))}
                                    className="flex-1 border border-[#c0c0c0] rounded px-3 py-2 bg-white text-base focus:outline-none focus:border-[#888]"
                                />
                            </div>
                            <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                                <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">期限日</span>
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
                    <div className="mt-[20px] pt-[20px] border-t border-[#e8e8e8] flex flex-col sm:flex-row gap-4 sm:gap-[3%]">
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">登録日</span>
                            <span className="flex-1 px-3 py-2 text-base text-gray-700">
                                {getFormatDatetime(new Date(task.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                            </span>
                        </div>
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap w-[5em] text-gray-500 text-base">更新日</span>
                            <span className="flex-1 px-3 py-2 text-base text-gray-700">
                                {getFormatDatetime(new Date(task.updatedAt), 'yyyy-MM-dd HH:mm:ss')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 保存確認ダイアログ */}
            <Dialog
                isOpen={isSaveDialogOpen}
                onClose={onCancelSave}
                title="保存"
                size="small"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        {`他ユーザーの${task.categoryName}です。`}<br />
                        保存してもよろしいですか？
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            colorType={"blue"}
                            sizeType={"medium"}
                            onClick={onCancelSave}
                        >
                            キャンセル
                        </Button>
                        <Button
                            colorType={"red"}
                            sizeType={"medium"}
                            onClick={onConfirmSave}
                        >
                            保存する
                        </Button>
                    </div>
                </div>
            </Dialog>

            {isLoading && <LoadingOverlay />}
        </div>
    );
}
