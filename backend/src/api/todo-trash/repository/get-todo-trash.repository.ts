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
                deleteFlg: outerTask.deleteFlg,
                parentId: outerTask.parentId,
                parentTitle: sql<string | null>`${this.parentTaskAlias.title}`,
                createdAt: outerTask.createdAt,
                updatedAt: outerTask.updatedAt,
                subtaskCount: sql<number>`(
                    SELECT COUNT(*) FROM task_transaction
                    WHERE parent_id = ${outerTask.id}
                )`,
            })
            .from(outerTask)
            .leftJoin(categoryMaster, eq(outerTask.categoryId, categoryMaster.id))
            .leftJoin(statusMaster, eq(outerTask.statusId, statusMaster.id))
            .leftJoin(priorityMaster, eq(outerTask.priorityId, priorityMaster.id))
            .leftJoin(this.parentTaskAlias, eq(outerTask.parentId, this.parentTaskAlias.id))
            .where(
                and(
                    eq(outerTask.deleteFlg, true),
                    eq(outerTask.id, taskId.value),
                    eq(outerTask.userId, userId.value),
                )
            )
            .get();
    }

}
