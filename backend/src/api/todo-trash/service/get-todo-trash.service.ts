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

    /**
     * 削除済み親タスクに紐づく全サブタスクを取得する
     */
    async findSubtasks(parentTaskId: TaskId, userId: FrontUserId) {
        return await this.repository.findSubtasks(parentTaskId, userId);
    }
}
