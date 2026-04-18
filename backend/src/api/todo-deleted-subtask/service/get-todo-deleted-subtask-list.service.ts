import { TaskId } from "../../../domain";
import type { DeletedSubtaskListResult, IGetTodoDeletedSubtaskListRepository } from "../repository/get-todo-deleted-subtask-list.repository.interface";
import { GetTodoDeletedSubtaskListQuerySchemaType } from "../schema/get-todo-deleted-subtask-list-query.schema";

/**
 * 削除タスク管理サブタスク一覧取得サービス（管理者用）
 */
export class GetTodoDeletedSubtaskListService {
    constructor(private readonly repository: IGetTodoDeletedSubtaskListRepository) { }

    /**
     * サブタスク一覧取得
     */
    async findAll(parentTaskId: TaskId, query: GetTodoDeletedSubtaskListQuerySchemaType): Promise<DeletedSubtaskListResult> {
        const [list, total] = await Promise.all([
            this.repository.findAll(parentTaskId, query),
            this.repository.count(parentTaskId),
        ]);

        return { list, total };
    }
}
