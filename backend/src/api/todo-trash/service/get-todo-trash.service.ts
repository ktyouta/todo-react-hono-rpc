import { FrontUserId } from "../../../domain";
import { TaskId } from "../../../domain/task-id";
import type { IGetTodoTrashRepository } from "../repository/get-todo-trash.repository.interface";

/**
 * ゴミ箱タスク取得サービス（一般ユーザー用）
 */
export class GetTodoTrashService {
    constructor(private readonly repository: IGetTodoTrashRepository) { }

    /**
     * ゴミ箱タスク取得
     */
    async find(taskId: TaskId, userId: FrontUserId) {
        return await this.repository.find(taskId, userId);
    }
}
