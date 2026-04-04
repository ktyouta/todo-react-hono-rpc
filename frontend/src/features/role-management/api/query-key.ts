export const roleManagementKeys = {
    all: ['role-management'] as const,
    lists: () => [...roleManagementKeys.all, 'list'] as const,
    list: (props: URLSearchParams) => [...roleManagementKeys.lists(), Object.fromEntries(props)] as const,
    details: () => [...roleManagementKeys.all, 'detail'] as const,
    detail: (id: string) => [...roleManagementKeys.details(), id] as const,
};
