import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TodoCreateRequestSchema, TodoCreateRequestType } from "../types/todo-create-request-type";

export function useTodoCreateForm() {
    return useForm<TodoCreateRequestType>({
        resolver: zodResolver(TodoCreateRequestSchema),
        defaultValues: {
            title: ``,
            content: ``,
            categoryId: 1,
            statusId: 1,
        },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });
}
