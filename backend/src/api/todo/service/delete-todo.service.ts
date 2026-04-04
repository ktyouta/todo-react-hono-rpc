import { FrontUserId } from "../../../domain";
import { TaskId } from "../../../domain/task-id";
import { IDeleteTodoRepository } from "../repository/delete-todo.repository.interface";

/**
 * タスク削除サービス
 */
export class DeleteTodoService {
  constructor(private readonly repository: IDeleteTodoRepository) { }

  /**
   * タスク取得
   */
  async find(userId: FrontUserId, taskId: TaskId) {
    const records = await this.repository.find(userId, taskId);
    return records;
  }
}
