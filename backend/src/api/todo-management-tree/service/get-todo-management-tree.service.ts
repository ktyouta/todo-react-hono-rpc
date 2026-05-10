import { TaskId } from "../../../domain/task-id";
import { IGetTodoManagementTreeRepository } from "../repository/get-todo-management-tree.repository.interface";

/**
 * タスクツリー取得サービス（管理者用）
 */
export class GetTodoManagementTreeService {
  constructor(private readonly repository: IGetTodoManagementTreeRepository) { }

  /**
   * タスクツリー取得
   */
  async findTree(taskId: TaskId) {
    return this.repository.findTree(taskId.value);
  }
}
