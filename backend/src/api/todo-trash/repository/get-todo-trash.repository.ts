import { and, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { FrontUserId } from "../../../domain";
import { TaskId } from "../../../domain/task-id";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import type { IGetTodoTrashRepository, TodoTrashItem } from "./get-todo-trash.repository.interface";

/**
 * ゴミ箱タスク取得リポジトリ実装（一般ユーザー用）
 */
export class GetTodoTrashRepository implements IGetTodoTrashRepository {
    private readonly parentTaskAlias: ReturnType<typeof alias<typeof taskTransaction, "parent_task">>;

    constructor(private readonly db: Database) {
        this.parentTaskAlias = alias(taskTransaction, "parent_task");
    }

    /**
     * ゴミ箱タスク取得（ログインユーザー自身のタスクのみ）
     */
    async find(taskId: TaskId, userId: FrontUserId): Promise<TodoTrashItem | undefined> {
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
                deleteFlg: taskTransaction.deleteFlg,
                parentId: taskTransaction.parentId,
                parentTitle: sql<string | null>`${this.parentTaskAlias.title}`,
                createdAt: taskTransaction.createdAt,
                updatedAt: taskTransaction.updatedAt,
            })
            .from(taskTransaction)
            .leftJoin(categoryMaster, eq(taskTransaction.categoryId, categoryMaster.id))
            .leftJoin(statusMaster, eq(taskTransaction.statusId, statusMaster.id))
            .leftJoin(priorityMaster, eq(taskTransaction.priorityId, priorityMaster.id))
            .leftJoin(this.parentTaskAlias, eq(taskTransaction.parentId, this.parentTaskAlias.id))
            .where(
                and(
                    eq(taskTransaction.deleteFlg, true),
                    eq(taskTransaction.id, taskId.value),
                    eq(taskTransaction.userId, userId.value),
                )
            )
            .get();
    }

}
