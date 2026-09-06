import { FrontUserId, TaskId } from "../../../domain";
import type { IGetParentTaskRepository, ParentTaskItem } from "../repository/get-parent-task.repository.interface";

/**
 * 親タスク取得サービス
 */
export class GetParentTaskService {
  constructor(private readonly repository: IGetParentTaskRepository) { }

  /**
   * 親タスク取得
   */
  async find(userId: FrontUserId, parentTaskId: TaskId): Promise<ParentTaskItem | undefined> {
    return await this.repository.find(userId, parentTaskId);
  }

  /**
   * 祖先タスクID一覧を取得（親タスク自身からルートまで）
   */
  async findAncestorIds(parentTaskId: TaskId): Promise<number[]> {
    return await this.repository.findAncestorIds(parentTaskId.value);
  }
}
