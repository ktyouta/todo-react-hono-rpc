import { Button, Textarea, Textbox } from "@/components";
import { BaseSyntheticEvent } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";


type PropsType = {
    register: UseFormRegister<{
        title: string;
        content: string;
    }>;
    errors: FieldErrors<{
        title: string;
        content: string;
    }>;
    clickCreate: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>
}

export function TodoCreate(props: PropsType) {

    const { register, errors, clickCreate } = props;

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
                        className="w-full  min-h-[500px] border-[#c0c0c0]"
                    />
                    {errors.content?.message && (
                        <p className="text-red-500 pl-1 mt-2">{errors.content.message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
