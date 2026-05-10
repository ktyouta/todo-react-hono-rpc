export const todoManagementKeys = {
    all: ['todo-management'] as const,
    lists: () => [...todoManagementKeys.all, 'list'] as const,
    list: (props: URLSearchParams) => [...todoManagementKeys.lists(), Object.fromEntries(props)] as const,
    details: () => [...todoManagementKeys.all, 'detail'] as const,
    detail: (id: string) => [...todoManagementKeys.details(), id] as const,
    subtaskLists: (taskId: string) => [...todoManagementKeys.all, 'subtask-list', taskId] as const,
    subtaskList: (taskId: string, page: number) => [...todoManagementKeys.subtaskLists(taskId), page] as const,
    tree: (id: string) => [...todoManagementKeys.all, 'tree', id] as const,
};
