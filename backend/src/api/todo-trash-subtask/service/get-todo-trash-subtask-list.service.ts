import { FrontUserId, TaskId } from "../../../domain";
import type { IGetTodoTrashSubtaskListRepository, TrashSubtaskListItem, TrashSubtaskListResult } from "../repository/get-todo-trash-subtask-list.repository.interface";
import { GetTodoTrashSubtaskListQuerySchemaType } from "../schema/get-todo-trash-subtask-list-query.schema";

/**
 * ゴミ箱サブタスク一覧取得サービス（一般ユーザー用）
 */
export class GetTodoTrashSubtaskListService {
    constructor(private readonly repository: IGetTodoTrashSubtaskListRepository) { }

    /**
     * サブタスク一覧取得
     */
    async findAll(userId: FrontUserId, parentTaskId: TaskId, query: GetTodoTrashSubtaskListQuerySchemaType): Promise<TrashSubtaskListResult> {
        const [list, total] = await Promise.all([
            this.repository.findAll(userId, parentTaskId, query),
            this.repository.count(userId, parentTaskId),
        ]);

        return { list, total };
    }
}
