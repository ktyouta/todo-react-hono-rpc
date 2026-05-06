import { FrontUserId } from "../../../domain";
import { TaskId } from "../../../domain/task-id";
import { IGetTodoTreeRepository } from "../repository/get-todo-tree.repository.interface";

/**
 * タスクツリー取得サービス
 */
export class GetTodoTreeService {
  constructor(private readonly repository: IGetTodoTreeRepository) { }

  /**
   * タスクツリー取得
   */
  async findTree(userId: FrontUserId, taskId: TaskId) {
    return this.repository.findTree(userId.value, taskId.value);
  }
}
