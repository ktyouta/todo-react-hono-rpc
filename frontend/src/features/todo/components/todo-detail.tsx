import { Button, Dialog, LoadingOverlay, Select, Textarea, Textbox } from "@/components";
import { CATEGORY_ID } from "@/constants/master";
import { CategoryReturnType } from "@/features/api/get-category";
import { StatusReturnType } from "@/features/api/get-status";
import { BaseSyntheticEvent } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { HiArrowLeft } from "react-icons/hi2";
import { TaskReturnType } from "../api/get-todo";
import { TodoDetailEditType } from "../types/todo-detail-edit-type";

type PropsType = {
    task: TaskReturnType;
    statusList: StatusReturnType;
    categoryList: CategoryReturnType;
    isEditMode: boolean;
    isDeleteDialogOpen: boolean;
    onClickBack: () => void;
    onClickEdit: () => void;
    onClickCancel: () => void;
    clickSave: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
    onClickDelete: () => void;
    onCancelDelete: () => void;
    onConfirmDelete: () => void;
    register: UseFormRegister<TodoDetailEditType>;
    errors: FieldErrors<TodoDetailEditType>;
    selectedCategoryId: number;
    isLoading: boolean;
}

export function TodoDetail(props: PropsType) {

    const {
        task,
        statusList,
        categoryList,
        isEditMode,
        isDeleteDialogOpen,
        onClickBack,
        onClickEdit,
        onClickCancel,
        clickSave,
        onClickDelete,
        onCancelDelete,
        onConfirmDelete,
        register,
        errors,
        selectedCategoryId,
        isLoading,
    } = props;

    return (
        <div className="w-full min-h-full flex flex-col pb-7">
            {/* 一覧に戻る */}
            <div className="mb-4">
                <button
                    type="button"
                    onClick={onClickBack}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                    <HiArrowLeft />
                    <span>一覧に戻る</span>
                </button>
            </div>

            {/* ヘッダー */}
            <div className="flex items-center pr-[10px]">
                <span className="font-bold text-[18px] sm:text-[22px]">
                    タスク詳細
                </span>
                <div className="flex-1" />
                {isEditMode ? (
                    <div className="flex gap-2">
                        <Button
                            colorType={"red"}
                            sizeType={"large"}
                            className="px-4 sm:px-10"
                            onClick={onClickCancel}
                        >
                            キャンセル
                        </Button>
                        <Button
                            colorType={"green"}
                            sizeType={"large"}
                            className="px-4 sm:px-10 bg-cyan-500 hover:bg-cyan-600"
                            onClick={clickSave}
                        >
                            保存
                        </Button>
                    </div>
                ) : (
                    <Button
                        colorType={"blue"}
                        sizeType={"large"}
                        className="px-4 sm:px-10"
                        onClick={onClickEdit}
                    >
                        編集
                    </Button>
                )}
            </div>

            {/* コンテンツ */}
            <div className="w-full pt-7 sm:pt-[50px] text-[15px] flex-1">
                <div className="w-full">
                    {isEditMode ? (
                        <>
                            <Textbox
                                registration={register("title")}
                                className="w-full border-[#c0c0c0] text-base sm:text-[17px] sm:py-2 sm:h-auto"
                                placeholder="タイトル"
                            />
                            {errors.title?.message && (
                                <p className="text-red-500 pl-1 mt-2">{errors.title.message}</p>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-base text-gray-400 mb-1 pl-0.5">タイトル</p>
                            <p className="w-full px-0.5 text-2xl font-semibold">
                                {task.title}
                            </p>
                        </>
                    )}
                </div>
                <div className="w-full p-3 sm:p-[20px] border border-[#c0c0c0] rounded mt-3 sm:mt-[20px] bg-white">
                    {isEditMode ? (
                        <>
                            <Textarea
                                registration={register("content")}
                                className="w-full min-h-[450px] border-[#c0c0c0] text-base sm:text-[17px]"
                            />
                            {errors.content?.message && (
                                <p className="text-red-500 pl-1 mt-2">{errors.content.message}</p>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-base text-gray-500 mb-3">タスク内容</p>
                            <p className="w-full min-h-[450px] text-lg whitespace-pre-wrap leading-relaxed text-gray-800">
                                {task.content}
                            </p>
                        </>
                    )}
                    <div className={`flex flex-col sm:flex-row gap-4 sm:gap-[3%] ${isEditMode ? "mt-[25px]" : "mt-[20px] pt-[20px] border-t border-[#e8e8e8]"}`}>
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap text-gray-500 text-base">カテゴリ</span>
                            {isEditMode ? (
                                <Select
                                    registration={register("categoryId", { valueAsNumber: true })}
                                    options={categoryList.map((c) => ({ value: String(c.id), label: c.name }))}
                                    className="flex-1 border border-[#c0c0c0] rounded px-3 py-2 bg-white text-base focus:outline-none focus:border-[#888]"
                                />
                            ) : (
                                <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-lg">
                                    {task.categoryName}
                                </span>
                            )}
                        </div>
                        {(isEditMode ? selectedCategoryId !== CATEGORY_ID.MEMO : task.statusId !== null) && (
                            <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                                <span className="whitespace-nowrap text-gray-500 text-base">ステータス</span>
                                {isEditMode ? (
                                    <Select
                                        registration={register("statusId", { valueAsNumber: true })}
                                        options={statusList.map((s) => ({ value: String(s.id), label: s.name }))}
                                        className="flex-1 border border-[#c0c0c0] rounded px-3 py-2 bg-white text-base focus:outline-none focus:border-[#888]"
                                    />
                                ) : (
                                    <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-lg">
                                        {task.statusName}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="mt-[20px] pt-[20px] border-t border-[#e8e8e8] flex flex-col sm:flex-row gap-4 sm:gap-[3%]">
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap text-gray-500 text-base">登録日</span>
                            <span className="flex-1 px-3 py-2 text-base text-gray-700">
                                {new Date(task.createdAt).toLocaleString('ja-JP')}
                            </span>
                        </div>
                        <div className="flex flex-1 items-center gap-2 sm:max-w-[48%]">
                            <span className="whitespace-nowrap text-gray-500 text-base">更新日</span>
                            <span className="flex-1 px-3 py-2 text-base text-gray-700">
                                {new Date(task.updatedAt).toLocaleString('ja-JP')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 削除エリア（閲覧時のみ） */}
            {!isEditMode && (
                <div className="mt-8 sm:mt-[60px] pt-4 sm:pt-[30px] border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 sm:p-5 border border-red-200 rounded bg-red-50">
                        <div>
                            <p className="text-sm font-medium text-red-700">タスクの削除</p>
                            <p className="text-sm text-gray-500 mt-1">このタスクを削除します。削除後は元に戻せません。</p>
                        </div>
                        <Button
                            colorType={"red"}
                            sizeType={"large"}
                            className="shrink-0"
                            onClick={onClickDelete}
                        >
                            タスクを削除する
                        </Button>
                    </div>
                </div>
            )}

            {/* 削除確認ダイアログ */}
            <Dialog
                isOpen={isDeleteDialogOpen}
                onClose={onCancelDelete}
                title="タスクの削除"
                size="small"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        このタスクを削除しますか？<br />
                        この操作は取り消せません。
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            colorType={"blue"}
                            sizeType={"medium"}
                            onClick={onCancelDelete}
                        >
                            キャンセル
                        </Button>
                        <Button
                            colorType={"red"}
                            sizeType={"medium"}
                            onClick={onConfirmDelete}
                        >
                            削除する
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* ローディングオーバーレイ */}
            {isLoading && <LoadingOverlay />}
        </div>
    );
}
