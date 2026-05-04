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
        return await this.db
            .select({
                id: taskTransaction.id,
                title: taskTransaction.title,
                content: taskTransaction.content,
                categoryId: taskTransaction.categoryId,
                categoryName: sql<string>`coalesce(${categoryMaster.name}, '')`,
                statusId: taskTransaction.statusId,
                statusName: sql<string>`coalesce(${statusMaster.name}, 'なし')`,
                priorityId: taskTransaction.priorityId,
                priorityName: sql<string>`coalesce(${priorityMaster.name}, 'なし')`,
                dueDate: taskTransaction.dueDate,
                userId: taskTransaction.userId,
                userName: sql<string>`coalesce(${frontUserMaster.name}, '')`,
                deleteFlg: taskTransaction.deleteFlg,
                createdAt: taskTransaction.createdAt,
                updatedAt: taskTransaction.updatedAt,
                parentId: taskTransaction.parentId,
                parentTitle: parentTask.title,
            })
            .from(taskTransaction)
            .leftJoin(categoryMaster, eq(taskTransaction.categoryId, categoryMaster.id))
            .leftJoin(statusMaster, eq(taskTransaction.statusId, statusMaster.id))
            .leftJoin(priorityMaster, eq(taskTransaction.priorityId, priorityMaster.id))
            .leftJoin(frontUserMaster, eq(taskTransaction.userId, frontUserMaster.id))
            .leftJoin(parentTask, eq(taskTransaction.parentId, parentTask.id))
            .where(
                and(
                    eq(taskTransaction.deleteFlg, true),
                    eq(taskTransaction.id, taskId.value),
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
