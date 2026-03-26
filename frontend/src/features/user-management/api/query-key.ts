export const userManagementKeys = {
    all: ['user-management'] as const,
    lists: () => [...userManagementKeys.all, 'list'] as const,
    list: (props: URLSearchParams) => [...userManagementKeys.lists(), Object.fromEntries(props)] as const,
    details: () => [...userManagementKeys.all, 'detail'] as const,
    detail: (id: string) => [...userManagementKeys.details(), id] as const,
};
