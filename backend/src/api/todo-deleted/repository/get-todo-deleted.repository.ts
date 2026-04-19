import { and, eq, sql } from "drizzle-orm";
import { TaskId } from "../../../domain/task-id";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, frontUserMaster, priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import type { IGetTodoDeletedRepository, TodoDeletedItem } from "./get-todo-deleted.repository.interface";

/**
 * 削除済みタスク取得リポジトリ実装（管理者用）
 */
export class GetTodoDeletedRepository implements IGetTodoDeletedRepository {
    constructor(private readonly db: Database) { }

    /**
     * 削除済みタスク取得（全ユーザー対象）
     */
    async find(taskId: TaskId): Promise<TodoDeletedItem | undefined> {
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
            })
            .from(taskTransaction)
            .leftJoin(categoryMaster, eq(taskTransaction.categoryId, categoryMaster.id))
            .leftJoin(statusMaster, eq(taskTransaction.statusId, statusMaster.id))
            .leftJoin(priorityMaster, eq(taskTransaction.priorityId, priorityMaster.id))
            .leftJoin(frontUserMaster, eq(taskTransaction.userId, frontUserMaster.id))
            .where(
                and(
                    eq(taskTransaction.deleteFlg, true),
                    eq(taskTransaction.id, taskId.value),
                )
            )
            .get();
    }
}
