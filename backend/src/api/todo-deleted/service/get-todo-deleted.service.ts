import { TaskId } from "../../../domain/task-id";
import type { IGetTodoDeletedRepository } from "../repository/get-todo-deleted.repository.interface";

/**
 * 削除済みタスク取得サービス（管理者用）
 */
export class GetTodoDeletedService {
    constructor(private readonly repository: IGetTodoDeletedRepository) { }

    /**
     * 削除済みタスク取得
     */
    async find(taskId: TaskId) {
        return await this.repository.find(taskId);
    }
}
