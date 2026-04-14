import { and, eq } from "drizzle-orm";
import { FrontUserId, TaskId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { taskTransaction } from "../../../infrastructure/db";
import type { IDeleteSubtaskRepository, SubtaskItem } from "./delete-subtask.repository.interface";

/**
 * サブタスク削除リポジトリ実装
 */
export class DeleteSubtaskRepository implements IDeleteSubtaskRepository {
  constructor(private readonly db: Database) { }

  /**
   * サブタスク取得
   */
  async find(userId: FrontUserId, parentTaskId: TaskId, subtaskId: TaskId): Promise<SubtaskItem | undefined> {
    return await this.db
      .select({
        isFavorite: taskTransaction.isFavorite,
      })
      .from(taskTransaction)
      .where(
        and(
          eq(taskTransaction.deleteFlg, false),
          eq(taskTransaction.userId, userId.value),
          eq(taskTransaction.parentId, parentTaskId.value),
          eq(taskTransaction.id, subtaskId.value),
        )
      )
      .get();
  }
}
