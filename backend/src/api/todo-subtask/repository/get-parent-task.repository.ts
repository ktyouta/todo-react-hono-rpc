import { and, eq, isNull } from "drizzle-orm";
import { FrontUserId, TaskId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { taskTransaction } from "../../../infrastructure/db";
import type { IGetParentTaskRepository, ParentTaskItem } from "./get-parent-task.repository.interface";

/**
 * 親タスク取得リポジトリ実装
 */
export class GetParentTaskRepository implements IGetParentTaskRepository {
  constructor(private readonly db: Database) { }

  /**
   * 親タスク取得（ルートタスクかつアクティブであることを確認）
   */
  async find(userId: FrontUserId, parentTaskId: TaskId): Promise<ParentTaskItem | undefined> {
    return await this.db
      .select({ id: taskTransaction.id })
      .from(taskTransaction)
      .where(
        and(
          eq(taskTransaction.id, parentTaskId.value),
          eq(taskTransaction.userId, userId.value),
          eq(taskTransaction.deleteFlg, false),
          isNull(taskTransaction.parentId),
        )
      )
      .get();
  }
}
