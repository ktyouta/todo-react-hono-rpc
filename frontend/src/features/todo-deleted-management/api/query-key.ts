export const todoDeletedManagementKeys = {
    all: ['todo-deleted-management'] as const,
    lists: () => [...todoDeletedManagementKeys.all, 'list'] as const,
    list: (props: URLSearchParams) => [...todoDeletedManagementKeys.lists(), Object.fromEntries(props)] as const,
    details: () => [...todoDeletedManagementKeys.all, 'detail'] as const,
    detail: (id: string) => [...todoDeletedManagementKeys.details(), id] as const,
};
