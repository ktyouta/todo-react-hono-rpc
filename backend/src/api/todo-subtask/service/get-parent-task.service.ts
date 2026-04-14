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
}
