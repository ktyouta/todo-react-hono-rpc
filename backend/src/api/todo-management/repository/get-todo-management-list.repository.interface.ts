import { GetTodoManagementListQuerySchemaType } from "../schema/get-todo-management-list-query.schema";

export type TodoManagementListItem = {
    id: number;
    title: string;
    content: string | null;
    categoryId: number;
    categoryName: string;
    statusId: number | null;
    statusName: string;
    priorityId: number | null;
    priorityName: string;
    dueDate: string | null;
    userId: number | null;
    userName: string;
    deleteFlg: boolean;
    createdAt: string;
    updatedAt: string;
};;

export type TodoManagementListResult = {
    list: TodoManagementListItem[];
    total: number;
};

export interface IGetTodoManagementListRepository {
    findAll(query: GetTodoManagementListQuerySchemaType): Promise<TodoManagementListItem[]>;
    count(query: GetTodoManagementListQuerySchemaType): Promise<number>;
}
