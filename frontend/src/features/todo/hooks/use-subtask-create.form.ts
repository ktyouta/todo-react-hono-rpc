import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TodoDetailEditSchema, TodoDetailEditType } from "../types/todo-detail-edit-type";

export const SUBTASK_CREATE_FORM_DEFAULT_VALUES = {
    title: "",
    content: "",
    category: 1,
    status: 1,
    priority: 1,
    dueDate: null,
} as const satisfies TodoDetailEditType;

export function useSubtaskCreateForm() {
    return useForm<TodoDetailEditType>({
        resolver: zodResolver(TodoDetailEditSchema),
        defaultValues: SUBTASK_CREATE_FORM_DEFAULT_VALUES,
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });
}
