import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TaskManagementReturnType } from "../api/get-todo-management";
import { TodoManagementDetailEditSchema, TodoManagementDetailEditType } from "../types/todo-management-detail-edit-type";

type PropsType = {
    task: TaskManagementReturnType;
};

export function useTodoManagementUpdateForm(props: PropsType) {
    const { task } = props;

    return useForm<TodoManagementDetailEditType>({
        resolver: zodResolver(TodoManagementDetailEditSchema),
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
