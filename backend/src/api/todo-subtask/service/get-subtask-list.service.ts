import { FrontUserId, TaskId } from "../../../domain";
import type { IGetSubtaskListRepository, SubtaskListItem } from "../repository/get-subtask-list.repository.interface";

/**
 * サブタスク一覧取得サービス
 */
export class GetSubtaskListService {
  constructor(private readonly repository: IGetSubtaskListRepository) { }

  /**
   * サブタスク一覧取得
   */
  async findAll(userId: FrontUserId, parentTaskId: TaskId): Promise<SubtaskListItem[]> {
    return await this.repository.findAll(userId, parentTaskId);
  }
}
