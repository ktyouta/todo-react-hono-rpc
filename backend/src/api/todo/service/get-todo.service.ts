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
    return this.repository.find(userId, taskId);
  }

  /**
   * 祖先タスク取得
   */
  async findAncestors(parentId: number) {
    return this.repository.findAncestors(parentId);
  }
}
