import { FrontUserId, TaskId } from "../../../domain";
import type { IDeleteSubtaskRepository, SubtaskItem } from "../repository/delete-subtask.repository.interface";

/**
 * サブタスク削除サービス
 */
export class DeleteSubtaskService {
  constructor(private readonly repository: IDeleteSubtaskRepository) { }

  /**
   * サブタスク取得
   */
  async find(userId: FrontUserId, parentTaskId: TaskId, subtaskId: TaskId): Promise<SubtaskItem | undefined> {
    return await this.repository.find(userId, parentTaskId, subtaskId);
  }
}
