import { FrontUserId } from "../../../domain";
import { TaskId } from "../../../domain/task-id";
import type { IUpdateTodoRepository } from "../repository/update-todo.repository.interface";

/**
 * タスク更新サービス
 */
export class UpdateTodoService {
  constructor(private readonly repository: IUpdateTodoRepository) { }

  /**
   * 更新対象タスクの祖先タスクID一覧を取得
   */
  async findAncestorIds(userId: FrontUserId, taskId: TaskId): Promise<number[]> {
    const task = await this.repository.findParentId(userId, taskId);

    if (!task?.parentId) {
      return [];
    }

    return await this.repository.findAncestorIds(task.parentId);
  }
}
