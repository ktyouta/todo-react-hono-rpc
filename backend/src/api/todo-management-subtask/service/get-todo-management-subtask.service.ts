import { TaskId } from "../../../domain";
import { IGetTodoManagementSubtaskRepository, ManagementSubtaskItem } from "../repository/get-todo-management-subtask.repository.interface";

/**
 * サブタスク詳細取得サービス
 */
export class GetTodoManagementSubtaskService {
  constructor(private readonly repository: IGetTodoManagementSubtaskRepository) { }

  /**
   * サブタスク取得
   */
  async find(parentTaskId: TaskId, subtaskId: TaskId): Promise<ManagementSubtaskItem | undefined> {
    return await this.repository.find(parentTaskId, subtaskId);
  }
}
