import { and, eq, sql } from "drizzle-orm";
import { FrontUserId, TaskId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { taskTransaction } from "../../../infrastructure/db";
import type { ICreateSubtaskRepository, ParentTaskItem } from "./create-subtask.repository.interface";

/**
 * サブタスク作成リポジトリ実装
 */
export class CreateSubtaskRepository implements ICreateSubtaskRepository {
  constructor(private readonly db: Database) { }

  /**
   * 親タスク取得（アクティブであることを確認）
   * @param userId
   * @param parentTaskId
   * @returns
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
        )
      )
      .get();
  }

  /**
   * 祖先タスクID一覧を取得（親タスク自身からルートまで）
   * @param parentTaskId
   * @returns
   */
  async findAncestorIds(parentTaskId: number): Promise<number[]> {
    const rows = await this.db.all<{ id: number }>(sql`
      WITH RECURSIVE ancestor_cte(id, parent_id, depth) AS (
        SELECT id, parent_id, 0
        FROM task_transaction
        WHERE id = ${parentTaskId}
        UNION ALL
        SELECT t.id, t.parent_id, a.depth + 1
        FROM task_transaction t
        INNER JOIN ancestor_cte a ON t.id = a.parent_id
        WHERE a.depth < 20
      )
      SELECT id FROM ancestor_cte
    `);

    return rows.map((row) => row.id);
  }
}
