export const userDeletedManagementKeys = {
    all: ['user-deleted-management'] as const,
    lists: () => [...userDeletedManagementKeys.all, 'list'] as const,
    list: (props: URLSearchParams) => [...userDeletedManagementKeys.lists(), Object.fromEntries(props)] as const,
    details: () => [...userDeletedManagementKeys.all, 'detail'] as const,
    detail: (id: string) => [...userDeletedManagementKeys.details(), id] as const,
};
