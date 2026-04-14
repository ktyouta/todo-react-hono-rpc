import { and, eq, gte, isNull, like, lte, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { FrontUserId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import { GetTodoTrashListQuerySchemaType } from "../schema/get-todo-trash-list-query.schema";
import type { IGetTodoTrashListRepository, TodoTrashListItem } from "./get-todo-trash-list.repository.interface";

/**
 * ゴミ箱タスク一覧取得リポジトリ実装（一般ユーザー用）
 */
export class GetTodoTrashListRepository implements IGetTodoTrashListRepository {

    // 最大取得件数
    static readonly LIMIT = 30;
    private readonly parentTaskAlias = alias(taskTransaction, "parent_task");
    constructor(private readonly db: Database) {
    }

    /**
     * 全件取得（ログインユーザー自身のタスクのみ）
     */
    async findAll(userId: FrontUserId, query: GetTodoTrashListQuerySchemaType): Promise<TodoTrashListItem[]> {
        const conditions = this.buildConditions(userId, query);

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
            .where(and(...conditions))
            .limit(GetTodoTrashListRepository.LIMIT)
            .offset((query.page - 1) * GetTodoTrashListRepository.LIMIT);
    }

    /**
     * 件数取得
     */
    async count(userId: FrontUserId, query: GetTodoTrashListQuerySchemaType): Promise<number> {
        const conditions = this.buildConditions(userId, query);

        const [{ total }] = await this.db
            .select({ total: sql<number>`count(*)` })
            .from(taskTransaction)
            .leftJoin(this.parentTaskAlias, eq(taskTransaction.parentId, this.parentTaskAlias.id))
            .where(and(...conditions));

        return total;
    }

    private buildConditions(userId: FrontUserId, query: GetTodoTrashListQuerySchemaType) {
        return [
            eq(taskTransaction.deleteFlg, true),
            eq(taskTransaction.userId, userId.value),
            or(
                isNull(taskTransaction.parentId),
                eq(this.parentTaskAlias.deleteFlg, false),
            ),
            ...(query.title ? [like(taskTransaction.title, `%${query.title}%`)] : []),
            ...(query.categoryId ? [eq(taskTransaction.categoryId, query.categoryId)] : []),
            ...(query.statusId ? [eq(taskTransaction.statusId, query.statusId)] : []),
            ...(query.priorityId ? [eq(taskTransaction.priorityId, query.priorityId)] : []),
            ...(query.dueDateFrom ? [gte(taskTransaction.dueDate, query.dueDateFrom)] : []),
            ...(query.dueDateTo ? [lte(taskTransaction.dueDate, query.dueDateTo)] : []),
            ...(query.updatedAtFrom ? [gte(taskTransaction.updatedAt, query.updatedAtFrom)] : []),
            ...(query.updatedAtTo ? [lte(taskTransaction.updatedAt, query.updatedAtTo)] : []),
        ];
    }
}
