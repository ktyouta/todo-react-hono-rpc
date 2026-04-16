import { FrontUserId, TaskId } from "../../../domain";
import type { IGetSubtaskRepository } from "../repository/get-subtask.repository.interface";

/**
 * サブタスク詳細取得サービス
 */
export class GetSubtaskService {
  constructor(private readonly repository: IGetSubtaskRepository) { }

  /**
   * サブタスク取得
   */
  async find(userId: FrontUserId, parentTaskId: TaskId, subtaskId: TaskId) {
    return await this.repository.find(userId, parentTaskId, subtaskId);
  }
}
