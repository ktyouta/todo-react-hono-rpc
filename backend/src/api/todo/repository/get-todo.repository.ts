import { and, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { FrontUserId } from "../../../domain";
import { TaskId } from "../../../domain/task-id";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import { AncestorItem, IGetTodoRepository, TodoItem } from "./get-todo.repository.interface";

/**
 * タスク一覧取得リポジトリ実装
 */
export class GetTodoRepository implements IGetTodoRepository {
  constructor(private readonly db: Database) { }

  /**
   * タスク取得
   */
  async find(userId: FrontUserId, taskId: TaskId): Promise<TodoItem | undefined> {
    const parentTask = alias(taskTransaction, 'parent_task');
    const outerTask = alias(taskTransaction, 'outer_task');
    const task = await this.db
      .select({
        id: outerTask.id,
        title: outerTask.title,
        content: outerTask.content,
        categoryId: outerTask.categoryId,
        categoryName: sql<string>`coalesce(${categoryMaster.name}, '')`,
        statusId: outerTask.statusId,
        statusName: sql<string>`coalesce(${statusMaster.name}, 'なし')`,
        priorityId: outerTask.priorityId,
        priorityName: sql<string>`coalesce(${priorityMaster.name}, 'なし')`,
        dueDate: outerTask.dueDate,
        userId: outerTask.userId,
        isFavorite: outerTask.isFavorite,
        deleteFlg: outerTask.deleteFlg,
        createdAt: outerTask.createdAt,
        updatedAt: outerTask.updatedAt,
        parentId: outerTask.parentId,
        parentTitle: parentTask.title,
        subtaskCount: sql<number>`(
            SELECT COUNT(*) FROM task_transaction
            WHERE parent_id = ${outerTask.id}
            AND delete_flg = 0
        )`
      })
      .from(outerTask)
      .leftJoin(categoryMaster, eq(outerTask.categoryId, categoryMaster.id))
      .leftJoin(statusMaster, eq(outerTask.statusId, statusMaster.id))
      .leftJoin(priorityMaster, eq(outerTask.priorityId, priorityMaster.id))
      .leftJoin(parentTask, eq(outerTask.parentId, parentTask.id))
      .where(
        and(
          eq(outerTask.deleteFlg, false),
          eq(outerTask.userId, userId.value),
          eq(outerTask.id, taskId.value),
        )
      )
      .get();

    return task ?? undefined;
  }

  /**
   * 祖先タスクをルートから直近の親の順で取得
   */
  async findAncestors(parentId: number): Promise<AncestorItem[]> {
    return this.db.all<AncestorItem>(sql`
      WITH RECURSIVE ancestor_cte(id, title, parent_id, depth) AS (
        SELECT id, title, parent_id, 0
        FROM task_transaction
        WHERE id = ${parentId}
        UNION ALL
        SELECT t.id, t.title, t.parent_id, a.depth + 1
        FROM task_transaction t
        INNER JOIN ancestor_cte a ON t.id = a.parent_id
        WHERE a.depth < 20
      )
      SELECT id, title FROM ancestor_cte ORDER BY depth DESC
    `);
  }
}
