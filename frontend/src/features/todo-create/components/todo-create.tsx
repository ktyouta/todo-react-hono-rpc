import { Button, Select, Textarea, Textbox } from "@/components";
import { CategoryReturnType } from "@/features/api/get-category";
import { StatusReturnType } from "@/features/api/get-status";
import { BaseSyntheticEvent } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { TodoCreateRequestType } from "../types/todo-create-request-type";

type PropsType = {
    register: UseFormRegister<TodoCreateRequestType>;
    errors: FieldErrors<TodoCreateRequestType>;
    clickCreate: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
    statusList: StatusReturnType;
    categoryList: CategoryReturnType;
}

export function TodoCreate(props: PropsType) {

    const {
        register,
        errors,
        clickCreate,
        statusList,
        categoryList } = props;

    return (
        <div className="w-full min-h-full">
            <div className="flex items-center pr-[10px]">
                <span className="font-bold text-[22px]">
                    タスク作成
                </span>
                <div className="flex-1" />
                <Button
                    colorType={"green"}
                    sizeType={"large"}
                    className="px-10 bg-cyan-500 hover:bg-cyan-600"
                    onClick={clickCreate}
                >
                    作成
                </Button>
            </div>
            <div className="w-full pt-[50px] text-[15px]">
                <div className="w-full">
                    <Textbox
                        registration={register("title")}
                        className="w-full border-[#c0c0c0]"
                        placeholder="タイトル"
                    />
                    {errors.title?.message && (
                        <p className="text-red-500 pl-1 mt-2">{errors.title.message}</p>
                    )}
                </div>
                <div className="w-full p-[20px] border border-[#c0c0c0] rounded mt-[20px] bg-white">
                    <Textarea
                        registration={register("content")}
                        className="w-full  min-h-[450px] border-[#c0c0c0]"
                    />
                    {errors.content?.message && (
                        <p className="text-red-500 pl-1 mt-2">{errors.content.message}</p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-[3%] mt-[25px]">
                        <div className="flex flex-1 items-center gap-2">
                            <span className="whitespace-nowrap">種別</span>
                            <Select
                                registration={register("categoryId", { valueAsNumber: true })}
                                options={categoryList.map((c) => ({ value: String(c.id), label: c.name }))}
                                className="flex-1 border border-[#c0c0c0] rounded px-3 py-2 bg-white text-[15px] focus:outline-none focus:border-[#888]"
                            />
                        </div>
                        <div className="flex flex-1 items-center gap-2">
                            <span className="whitespace-nowrap">ステータス</span>
                            <Select
                                registration={register("statusId", { valueAsNumber: true })}
                                options={statusList.map((s) => ({ value: String(s.id), label: s.name }))}
                                className="flex-1 border border-[#c0c0c0] rounded px-3 py-2 bg-white text-[15px] focus:outline-none focus:border-[#888]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
