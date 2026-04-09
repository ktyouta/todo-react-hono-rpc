export type TodoTrashSearchFilter = {
    title: string;
    categoryId: string;
    statusId: string;
    priorityId: string;
    dueDateFrom: string | null;
    dueDateTo: string | null;
    updatedAtFrom: string | null;
    updatedAtTo: string | null;
};

export const initialTodoTrashSearchFilter: TodoTrashSearchFilter = {
    title: '',
    categoryId: '',
    statusId: '',
    priorityId: '',
    dueDateFrom: null,
    dueDateTo: null,
    updatedAtFrom: null,
    updatedAtTo: null,
};
