import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TodoDetailEditSchema, TodoDetailEditType } from "../types/todo-detail-edit-type";

export function useSubtaskCreateForm() {
    return useForm<TodoDetailEditType>({
        resolver: zodResolver(TodoDetailEditSchema),
        defaultValues: {
            title: "",
            content: "",
            category: 1,
            status: 1,
            priority: 1,
            dueDate: null,
        },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });
}
