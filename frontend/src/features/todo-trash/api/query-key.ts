export const todoTrashKeys = {
    all: ['todo-trash'] as const,
    lists: () => [...todoTrashKeys.all, 'list'] as const,
    list: (props: URLSearchParams) => [...todoTrashKeys.lists(), Object.fromEntries(props)] as const,
    details: () => [...todoTrashKeys.all, 'detail'] as const,
    detail: (id: string) => [...todoTrashKeys.details(), id] as const,
    subtaskLists: (id: string) => [...todoTrashKeys.details(), id, 'subtasks'] as const,
    subtaskList: (id: string, page: number) => [...todoTrashKeys.subtaskLists(id), page] as const,
};
