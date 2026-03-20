import { GetTodoManagementListQuerySchemaType } from "../schema/get-todo-management-list-query.schema";
import { TodoManagementItem } from "./get-todo-management.repository.interface";

export type TodoManagementListItem = TodoManagementItem;

export type TodoManagementListResult = {
    list: TodoManagementListItem[];
    total: number;
};

export interface IGetTodoManagementListRepository {
    findAll(query: GetTodoManagementListQuerySchemaType): Promise<TodoManagementListItem[]>;
    count(query: GetTodoManagementListQuerySchemaType): Promise<number>;
}
