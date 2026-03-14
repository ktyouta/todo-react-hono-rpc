
export const todoKeys = {
    all: ['todo'] as const,
    lists: () => [todoKeys.all, 'list'] as const,
    list: (props: URLSearchParams) => [todoKeys.lists(), Object.fromEntries(props)] as const,
    details: () => [todoKeys.all, 'detail'] as const,
    detail: (id: string) => [todoKeys.details(), id] as const,
};