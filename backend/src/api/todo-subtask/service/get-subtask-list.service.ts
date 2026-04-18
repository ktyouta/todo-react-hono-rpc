import { FrontUserId, TaskId } from "../../../domain";
import { GetSubtaskListQuerySchemaType } from "../schema/get-subtask-list-query.schema";
import type { IGetSubtaskListRepository, SubtaskListResult } from "../repository/get-subtask-list.repository.interface";

/**
 * サブタスク一覧取得サービス
 */
export class GetSubtaskListService {
  constructor(private readonly repository: IGetSubtaskListRepository) { }

  /**
   * サブタスク一覧取得
   */
  async findAll(userId: FrontUserId, parentTaskId: TaskId, query: GetSubtaskListQuerySchemaType): Promise<SubtaskListResult> {
    const [list, total] = await Promise.all([
      this.repository.findAll(userId, parentTaskId, query),
      this.repository.count(userId, parentTaskId),
    ]);
    return { list, total };
  }
}
