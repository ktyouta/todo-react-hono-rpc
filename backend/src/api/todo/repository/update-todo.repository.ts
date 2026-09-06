import { and, eq, sql } from "drizzle-orm";
import { FrontUserId } from "../../../domain";
import { TaskId } from "../../../domain/task-id";
import type { Database } from "../../../infrastructure/db";
import { taskTransaction } from "../../../infrastructure/db";
import type { IUpdateTodoRepository, UpdateTodoParentItem } from "./update-todo.repository.interface";

/**
 * タスク更新リポジトリ実装
 */
export class UpdateTodoRepository implements IUpdateTodoRepository {
  constructor(private readonly db: Database) { }

  /**
   * 更新対象タスクの親タスクIDを取得
   */
  async findParentId(userId: FrontUserId, taskId: TaskId): Promise<UpdateTodoParentItem | undefined> {
    return await this.db
      .select({ parentId: taskTransaction.parentId })
      .from(taskTransaction)
      .where(
        and(
          eq(taskTransaction.id, taskId.value),
          eq(taskTransaction.userId, userId.value),
          eq(taskTransaction.deleteFlg, false),
        )
      )
      .get();
  }

  /**
   * 祖先タスクID一覧を取得（親タスク自身からルートまで）
   */
  async findAncestorIds(parentId: number): Promise<number[]> {
    const rows = await this.db.all<{ id: number }>(sql`
      WITH RECURSIVE ancestor_cte(id, parent_id, depth) AS (
        SELECT id, parent_id, 0
        FROM task_transaction
        WHERE id = ${parentId}
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
