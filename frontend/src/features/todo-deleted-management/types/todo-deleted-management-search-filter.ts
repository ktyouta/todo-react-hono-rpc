export type TodoDeletedManagementSearchFilter = {
    userId: string;
    title: string;
    categoryId: string;
    statusId: string;
    priorityId: string;
    dueDateFrom: string | null;
    dueDateTo: string | null;
    updatedAtFrom: string | null;
    updatedAtTo: string | null;
};

export const initialTodoDeletedManagementSearchFilter: TodoDeletedManagementSearchFilter = {
    userId: '',
    title: '',
    categoryId: '',
    statusId: '',
    priorityId: '',
    dueDateFrom: null,
    dueDateTo: null,
    updatedAtFrom: null,
    updatedAtTo: null,
};
