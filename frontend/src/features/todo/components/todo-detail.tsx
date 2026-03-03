import { Button, Select, Textarea, Textbox } from "@/components";
import { CATEGORY_ID } from "@/constants/master";
import { CategoryReturnType } from "@/features/api/get-category";
import { StatusReturnType } from "@/features/api/get-status";
import { BaseSyntheticEvent } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { TaskReturnType } from "../api/get-todo";
import { TodoDetailEditType } from "../types/todo-detail-edit-type";

type PropsType = {
    task: TaskReturnType;
    statusList: StatusReturnType;
    categoryList: CategoryReturnType;
    isEditMode: boolean;
    onClickEdit: () => void;
    onClickCancel: () => void;
    clickSave: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
    register: UseFormRegister<TodoDetailEditType>;
    errors: FieldErrors<TodoDetailEditType>;
    selectedCategoryId: number;
}

export function TodoDetail(props: PropsType) {

    const {
        task,
        statusList,
        categoryList,
        isEditMode,
        onClickEdit,
        onClickCancel,
        clickSave,
        register,
        errors,
        selectedCategoryId,
    } = props;

    return (
        <div className="w-full min-h-full">
            <div className="flex items-center pr-[10px]">
                <span className="font-bold text-[22px]">
                    タスク詳細
                </span>
                <div className="flex-1" />
                {isEditMode ? (
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
                ) : (
                    <Button
                        colorType={"blue"}
                        sizeType={"large"}
                        className="px-10"
                        onClick={onClickEdit}
                    >
                        編集
                    </Button>
                )}
            </div>
            <div className="w-full pt-[50px] text-[15px]">
                <div className="w-full">
                    {isEditMode ? (
                        <>
                            <Textbox
                                registration={register("title")}
                                className="w-full border-[#c0c0c0]"
                                placeholder="タイトル"
                            />
                            {errors.title?.message && (
                                <p className="text-red-500 pl-1 mt-2">{errors.title.message}</p>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-xs text-gray-400 mb-1 pl-0.5">タイトル</p>
                            <p className="w-full px-0.5 text-[16px] font-medium">
                                {task.title}
                            </p>
                        </>
                    )}
                </div>
                <div className="w-full p-[20px] border border-[#c0c0c0] rounded mt-[20px] bg-white">
                    {isEditMode ? (
                        <>
                            <Textarea
                                registration={register("content")}
                                className="w-full min-h-[450px] border-[#c0c0c0]"
                            />
                            {errors.content?.message && (
                                <p className="text-red-500 pl-1 mt-2">{errors.content.message}</p>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-xs text-gray-400 mb-3">タスク内容</p>
                            <p className="w-full min-h-[450px] text-sm whitespace-pre-wrap leading-relaxed text-gray-800">
                                {task.content}
                            </p>
                        </>
                    )}
                    <div className={`flex flex-col sm:flex-row gap-[3%] ${isEditMode ? "mt-[25px]" : "mt-[20px] pt-[20px] border-t border-[#e8e8e8]"}`}>
                        <div className="flex flex-1 items-center gap-2 max-w-[48%]">
                            <span className="whitespace-nowrap text-gray-500 text-sm">カテゴリ</span>
                            {isEditMode ? (
                                <Select
                                    registration={register("categoryId", { valueAsNumber: true })}
                                    options={categoryList.map((c) => ({ value: String(c.id), label: c.name }))}
                                    className="flex-1 border border-[#c0c0c0] rounded px-3 py-2 bg-white text-[15px] focus:outline-none focus:border-[#888]"
                                />
                            ) : (
                                <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-[15px]">
                                    {task.categoryName}
                                </span>
                            )}
                        </div>
                        {(isEditMode ? selectedCategoryId !== CATEGORY_ID.MEMO : task.statusId !== null) && (
                            <div className="flex flex-1 items-center gap-2 max-w-[48%]">
                                <span className="whitespace-nowrap text-gray-500 text-sm">ステータス</span>
                                {isEditMode ? (
                                    <Select
                                        registration={register("statusId", { valueAsNumber: true })}
                                        options={statusList.map((s) => ({ value: String(s.id), label: s.name }))}
                                        className="flex-1 border border-[#c0c0c0] rounded px-3 py-2 bg-white text-[15px] focus:outline-none focus:border-[#888]"
                                    />
                                ) : (
                                    <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-[15px]">
                                        {task.statusName}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
