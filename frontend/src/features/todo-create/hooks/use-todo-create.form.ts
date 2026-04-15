import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TodoCreateRequestSchema, TodoCreateRequestType } from "../types/todo-create-request-type";

export const TODO_CREATE_FORM_DEFAULT_VALUES = {
    title: ``,
    content: ``,
    category: 1,
    status: 1,
    priority: 1,
    dueDate: null,
} as const satisfies TodoCreateRequestType;

export function useTodoCreateForm() {
    return useForm<TodoCreateRequestType>({
        resolver: zodResolver(TodoCreateRequestSchema),
        defaultValues: TODO_CREATE_FORM_DEFAULT_VALUES,
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });
}
