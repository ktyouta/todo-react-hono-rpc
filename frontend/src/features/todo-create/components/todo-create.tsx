import { Button, Textarea, Textbox } from "@/components";
import { useTodoCreate } from "../hooks/use-todo-create";

export function TodoCreate() {

    const {
        title,
        changeTitle,
        content,
        changeContent,
        clickCreate, } = useTodoCreate();

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
                    className="px-10"
                    onClick={clickCreate}
                >
                    作成
                </Button>
            </div>
            <div className="w-full pt-[50px]">
                <div className="w-full">
                    <Textbox
                        value={title}
                        onChange={changeTitle}
                        className="w-full border-[#c0c0c0]"
                        placeholder="タイトル"
                    />
                </div>
                <div className="w-full p-[20px] border border-[#c0c0c0] rounded mt-[20px] bg-white">
                    <Textarea
                        value={content}
                        onChange={changeContent}
                        className="w-full  min-h-[500px] border-[#c0c0c0]"
                    />
                </div>
            </div>
        </div>
    );
}