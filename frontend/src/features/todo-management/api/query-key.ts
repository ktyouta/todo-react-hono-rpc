export const todoManagementKeys = {
    all: ['todo-management'] as const,
    lists: () => [...todoManagementKeys.all, 'list'] as const,
    list: (props: URLSearchParams) => [...todoManagementKeys.lists(), Object.fromEntries(props)] as const,
    details: () => [...todoManagementKeys.all, 'detail'] as const,
    detail: (id: string) => [...todoManagementKeys.details(), id] as const,
    subtaskLists: (taskId: string) => [...todoManagementKeys.all, 'subtask-list', taskId] as const,
    subtaskDetails: (taskId: string) => [...todoManagementKeys.all, 'subtask-detail', taskId] as const,
    subtaskDetail: (taskId: string, subId: string) => [...todoManagementKeys.subtaskDetails(taskId), subId] as const,
};
