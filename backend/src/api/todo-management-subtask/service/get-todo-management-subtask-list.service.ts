import { TaskId } from "../../../domain";
import type { IGetTodoManagementSubtaskListRepository, ManagementSubtaskListItem } from "../repository/get-todo-management-subtask-list.repository.interface";

/**
 * サブタスク一覧取得サービス（管理者用）
 */
export class GetTodoManagementSubtaskListService {
  constructor(private readonly repository: IGetTodoManagementSubtaskListRepository) { }

  /**
   * サブタスク一覧取得
   */
  async findAll(parentTaskId: TaskId): Promise<ManagementSubtaskListItem[]> {
    return await this.repository.findAll(parentTaskId);
  }
}
