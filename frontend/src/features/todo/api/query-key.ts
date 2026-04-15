
export const todoKeys = {
    all: ['todo'] as const,
    lists: () => [...todoKeys.all, 'list'] as const,
    list: (props: URLSearchParams) => [...todoKeys.lists(), Object.fromEntries(props)] as const,
    details: () => [...todoKeys.all, 'detail'] as const,
    detail: (id: string) => [...todoKeys.details(), id] as const,
    subtaskLists: (taskId: string) => [...todoKeys.all, 'subtask-list', taskId] as const,
    subtaskDetails: (taskId: string) => [...todoKeys.all, 'subtask-detail', taskId] as const,
    subtaskDetail: (taskId: string, subId: string) => [...todoKeys.subtaskDetails(taskId), subId] as const,
};