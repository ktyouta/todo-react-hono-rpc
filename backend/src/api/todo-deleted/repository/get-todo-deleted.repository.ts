import { and, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { TaskId } from "../../../domain/task-id";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, frontUserMaster, priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import type { AncestorItem, IGetTodoDeletedRepository, TodoDeletedItem } from "./get-todo-deleted.repository.interface";

/**
 * 削除済みタスク取得リポジトリ実装（管理者用）
 */
export class GetTodoDeletedRepository implements IGetTodoDeletedRepository {
    constructor(private readonly db: Database) { }

    /**
     * 削除済みタスク取得（全ユーザー対象）
     */
    async find(taskId: TaskId): Promise<TodoDeletedItem | undefined> {
        const parentTask = alias(taskTransaction, 'parent_task');
        const outerTask = alias(taskTransaction, 'outer_task');
        return await this.db
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
                userName: sql<string>`coalesce(${frontUserMaster.name}, '')`,
                deleteFlg: outerTask.deleteFlg,
                createdAt: outerTask.createdAt,
                updatedAt: outerTask.updatedAt,
                parentId: outerTask.parentId,
                parentTitle: parentTask.title,
                subtaskCount: sql<number>`(
                    SELECT COUNT(*) FROM task_transaction
                    WHERE parent_id = ${outerTask.id}
                )`,
            })
            .from(outerTask)
            .leftJoin(categoryMaster, eq(outerTask.categoryId, categoryMaster.id))
            .leftJoin(statusMaster, eq(outerTask.statusId, statusMaster.id))
            .leftJoin(priorityMaster, eq(outerTask.priorityId, priorityMaster.id))
            .leftJoin(frontUserMaster, eq(outerTask.userId, frontUserMaster.id))
            .leftJoin(parentTask, eq(outerTask.parentId, parentTask.id))
            .where(
                and(
                    eq(outerTask.deleteFlg, true),
                    eq(outerTask.id, taskId.value),
                )
            )
            .get();
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
