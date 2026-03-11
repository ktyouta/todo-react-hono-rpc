import { TodoSearchFilter } from "../types/todo-search-filter";

export const todoKeys = {
    all: ['todo'] as const,
    lists: () => [todoKeys.all, 'list'] as const,
    list: (props: TodoSearchFilter) => [todoKeys.lists(), props] as const,
    details: () => [todoKeys.all, 'detail'] as const,
    detail: (id: string) => [todoKeys.details(), id] as const,
};