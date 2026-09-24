import { FrontUserId, TaskId } from "../../../domain";
import type { ICreateSubtaskRepository, ParentTaskItem } from "../repository/create-subtask.repository.interface";

/**
 * サブタスク作成サービス
 */
export class CreateSubtaskService {
  constructor(private readonly repository: ICreateSubtaskRepository) { }

  /**
   * 親タスク取得
   * @param userId
   * @param parentTaskId
   * @returns
   */
  async find(userId: FrontUserId, parentTaskId: TaskId): Promise<ParentTaskItem | undefined> {
    return await this.repository.find(userId, parentTaskId);
  }

  /**
   * 祖先タスクID一覧を取得（親タスク自身からルートまで）
   * @param parentTaskId
   * @returns
   */
  async findAncestorIds(parentTaskId: TaskId): Promise<number[]> {
    return await this.repository.findAncestorIds(parentTaskId.value);
  }
}
