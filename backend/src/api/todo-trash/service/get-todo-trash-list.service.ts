import { FrontUserId } from "../../../domain";
import type { IGetTodoTrashListRepository, TodoTrashListResult } from "../repository/get-todo-trash-list.repository.interface";
import { GetTodoTrashListQuerySchemaType } from "../schema/get-todo-trash-list-query.schema";

/**
 * ゴミ箱タスク一覧取得サービス（一般ユーザー用）
 */
export class GetTodoTrashListService {
    constructor(private readonly repository: IGetTodoTrashListRepository) { }

    /**
     * 全件取得
     */
    async findAll(userId: FrontUserId, query: GetTodoTrashListQuerySchemaType): Promise<TodoTrashListResult> {
        const [list, total] = await Promise.all([
            this.repository.findAll(userId, query),
            this.repository.count(userId, query),
        ]);
        return { list, total };
    }
}
