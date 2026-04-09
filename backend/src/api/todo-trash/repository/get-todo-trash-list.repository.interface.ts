import { FrontUserId } from "../../../domain";
import { GetTodoTrashListQuerySchemaType } from "../schema/get-todo-trash-list-query.schema";
import { TodoTrashItem } from "./get-todo-trash.repository.interface";

export type TodoTrashListItem = TodoTrashItem;

export type TodoTrashListResult = {
    list: TodoTrashListItem[];
    total: number;
};

export interface IGetTodoTrashListRepository {
    findAll(userId: FrontUserId, query: GetTodoTrashListQuerySchemaType): Promise<TodoTrashListItem[]>;
    count(userId: FrontUserId, query: GetTodoTrashListQuerySchemaType): Promise<number>;
}
