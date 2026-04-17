import { TodoDetailEditSchema, TodoDetailEditType } from "@/features/todo/types/todo-detail-edit-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ManagementSubtaskDataType } from "../api/get-todo-management-subtask";

type PropsType = {
    task: ManagementSubtaskDataType;
};

export function useTodoManagementSubtaskUpdateForm(props: PropsType) {
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
