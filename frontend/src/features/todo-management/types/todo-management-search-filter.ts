export type TodoManagementSearchFilter = {
    userId: string;
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
};

export const initialTodoManagementSearchFilter: TodoManagementSearchFilter = {
    userId: '',
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
};
