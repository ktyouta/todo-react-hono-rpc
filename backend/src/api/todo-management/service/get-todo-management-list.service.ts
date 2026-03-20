import type { IGetTodoManagementListRepository, TodoManagementListResult } from "../repository/get-todo-management-list.repository.interface";
import { GetTodoManagementListQuerySchemaType } from "../schema/get-todo-management-list-query.schema";

/**
 * タスク一覧取得サービス（管理者用）
 */
export class GetTodoManagementListService {
    constructor(private readonly repository: IGetTodoManagementListRepository) { }

    /**
     * 全件取得
     */
    async findAll(query: GetTodoManagementListQuerySchemaType): Promise<TodoManagementListResult> {
        const [list, total] = await Promise.all([
            this.repository.findAll(query),
            this.repository.count(query),
        ]);
        return { list, total };
    }
}
