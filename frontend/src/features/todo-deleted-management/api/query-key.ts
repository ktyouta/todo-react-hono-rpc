export const todoDeletedManagementKeys = {
    all: ['todo-deleted-management'] as const,
    lists: () => [...todoDeletedManagementKeys.all, 'list'] as const,
    list: (props: URLSearchParams) => [...todoDeletedManagementKeys.lists(), Object.fromEntries(props)] as const,
    details: () => [...todoDeletedManagementKeys.all, 'detail'] as const,
    detail: (id: string) => [...todoDeletedManagementKeys.details(), id] as const,
    subtaskLists: (taskId: string) => [...todoDeletedManagementKeys.all, 'subtask-list', taskId] as const,
    subtaskList: (taskId: string, page: number) => [...todoDeletedManagementKeys.subtaskLists(taskId), page] as const,
};
