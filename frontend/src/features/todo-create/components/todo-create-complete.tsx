import { Button } from "@/components";
import { HiCheckCircle } from "react-icons/hi2";

type PropsType = {
    createdTitle: string;
    clickGoToList: () => void;
    clickContinue: () => void;
}

export function TodoCreateComplete(props: PropsType) {

    const { createdTitle, clickGoToList, clickContinue } = props;

    return (
        <div className="w-full min-h-full">
            <div className="flex items-center pr-[10px]">
                <span className="font-bold text-[18px] sm:text-[22px] dark:text-gray-100">
                    タスク作成
                </span>
            </div>
            <div className="w-full pt-7 sm:pt-[50px]">
                <div className="w-full p-5 sm:p-7 bg-gray-50 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center justify-center gap-2">
                        <HiCheckCircle className="text-cyan-500 text-[22px] sm:text-[24px]" />
                        <span className="font-bold text-[18px] sm:text-[22px] dark:text-gray-100">作成完了</span>
                    </div>
                    <p className="mt-3 text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-300 text-center break-all">
                        {createdTitle}
                    </p>
                </div>
                <div className="flex items-center justify-end gap-2 sm:gap-3 mt-4">
                    <Button
                        colorType={"green"}
                        sizeType={"large"}
                        className="px-4 sm:px-6 bg-gray-400 hover:bg-gray-500"
                        onClick={clickGoToList}
                    >
                        一覧へ
                    </Button>
                    <Button
                        colorType={"green"}
                        sizeType={"large"}
                        className="px-4 sm:px-10 bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-900 dark:hover:bg-cyan-800"
                        onClick={clickContinue}
                    >
                        続けてタスクを作成する
                    </Button>
                </div>
            </div>
        </div>
    );
}
