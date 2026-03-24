import type { IGetTodoDeletedListRepository, TodoDeletedListResult } from "../repository/get-todo-deleted-list.repository.interface";
import { GetTodoDeletedListQuerySchemaType } from "../schema/get-todo-deleted-list-query.schema";

/**
 * 削除済みタスク一覧取得サービス（管理者用）
 */
export class GetTodoDeletedListService {
    constructor(private readonly repository: IGetTodoDeletedListRepository) { }

    /**
     * 全件取得
     */
    async findAll(query: GetTodoDeletedListQuerySchemaType): Promise<TodoDeletedListResult> {
        const [list, total] = await Promise.all([
            this.repository.findAll(query),
            this.repository.count(query),
        ]);
        return { list, total };
    }
}
