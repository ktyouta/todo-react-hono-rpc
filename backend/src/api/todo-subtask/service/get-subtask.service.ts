import { FrontUserId, TaskId } from "../../../domain";
import type { SubtaskListItem } from "../repository/get-subtask-list.repository.interface";
import type { IGetSubtaskRepository } from "../repository/get-subtask.repository.interface";

/**
 * サブタスク詳細取得サービス
 */
export class GetSubtaskService {
  constructor(private readonly repository: IGetSubtaskRepository) { }

  /**
   * サブタスク取得
   */
  async find(userId: FrontUserId, parentTaskId: TaskId, subtaskId: TaskId): Promise<SubtaskListItem | undefined> {
    return await this.repository.find(userId, parentTaskId, subtaskId);
  }
}
