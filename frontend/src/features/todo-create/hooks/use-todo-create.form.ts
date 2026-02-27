import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TodoCreateRequestSchema, TodoCreateRequestType } from "../types/todo-create-request-type";

export function useTodoCreateForm() {
    return useForm<TodoCreateRequestType>({
        resolver: zodResolver(TodoCreateRequestSchema),
        defaultValues: {
            title: ``,
            content: ``,
        },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });
}
