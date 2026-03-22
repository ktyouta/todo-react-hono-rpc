export type TodoSearchFilter = {
    title: string;
    categoryId: string;
    statusId: string;
    priorityId: string;
    dueDateFrom: string | null;
    dueDateTo: string | null;
    createdAtFrom: string | null;
    createdAtTo: string | null;
    updatedAtFrom: string | null;
    updatedAtTo: string | null;
    isFavorite: boolean;
};

export const initialTodoSearchFilter: TodoSearchFilter = {
    title: '',
    categoryId: '',
    statusId: '',
    priorityId: '',
    dueDateFrom: null,
    dueDateTo: null,
    createdAtFrom: null,
    createdAtTo: null,
    updatedAtFrom: null,
    updatedAtTo: null,
    isFavorite: false,
};
