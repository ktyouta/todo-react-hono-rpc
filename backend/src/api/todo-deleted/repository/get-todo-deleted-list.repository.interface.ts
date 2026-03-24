import { GetTodoDeletedListQuerySchemaType } from "../schema/get-todo-deleted-list-query.schema";
import { TodoDeletedItem } from "./get-todo-deleted.repository.interface";

export type TodoDeletedListItem = TodoDeletedItem;

export type TodoDeletedListResult = {
    list: TodoDeletedListItem[];
    total: number;
};

export interface IGetTodoDeletedListRepository {
    findAll(query: GetTodoDeletedListQuerySchemaType): Promise<TodoDeletedListItem[]>;
    count(query: GetTodoDeletedListQuerySchemaType): Promise<number>;
}
