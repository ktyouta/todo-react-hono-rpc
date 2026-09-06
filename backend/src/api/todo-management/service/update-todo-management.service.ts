import { TaskId } from "../../../domain/task-id";
import type { IUpdateTodoManagementRepository } from "../repository/update-todo-management.repository.interface";

/**
 * タスク更新（管理者用）サービス
 */
export class UpdateTodoManagementService {
  constructor(private readonly repository: IUpdateTodoManagementRepository) { }

  /**
   * 更新対象タスクの祖先タスクID一覧を取得
   */
  async findAncestorIds(taskId: TaskId): Promise<number[]> {
    const task = await this.repository.findParentId(taskId);

    if (!task?.parentId) {
      return [];
    }

    return await this.repository.findAncestorIds(task.parentId);
  }
}
