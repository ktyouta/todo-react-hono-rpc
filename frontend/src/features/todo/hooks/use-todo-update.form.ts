import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TaskDataType } from "../api/get-todo";
import { TodoDetailEditSchema, TodoDetailEditType } from "../types/todo-detail-edit-type";

type PropsType = {
    task: TaskDataType
}

export function useTodoUpdateForm(props: PropsType) {

    const { task } = props;

    return useForm<TodoDetailEditType>({
        resolver: zodResolver(TodoDetailEditSchema),
        defaultValues: {
            title: task.title,
            content: task.content ?? "",
            category: task.categoryId,
            status: task.statusId ?? undefined,
            priority: task.priorityId ?? undefined,
            dueDate: task.dueDate ?? null,
        },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });
}
