import { FrontUserId } from "../../../domain";
import { TaskId } from "../../../domain/task-id";
import { IGetTodoRepository } from "../repository/get-todo.repository.interface";

/**
 * タスク取得サービス
 */
export class GetTodoService {
  constructor(private readonly repository: IGetTodoRepository) { }

  /**
   * タスク取得
   */
  async find(userId: FrontUserId, taskId: TaskId) {
    const records = await this.repository.find(userId, taskId);
    return records;
  }
}
