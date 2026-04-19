import { and, eq, gte, isNull, like, lte, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, frontUserMaster, priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import { GetTodoDeletedListQuerySchemaType } from "../schema/get-todo-deleted-list-query.schema";
import type { IGetTodoDeletedListRepository, TodoDeletedListItem } from "./get-todo-deleted-list.repository.interface";

/**
 * 削除済みタスク一覧取得リポジトリ実装（管理者用）
 */
export class GetTodoDeletedListRepository implements IGetTodoDeletedListRepository {

    // 最大取得件数
    static readonly LIMIT = 30;

    private readonly parentTaskAlias = alias(taskTransaction, "parent_task");

    constructor(private readonly db: Database) { }

    /**
     * 全件取得（全ユーザー対象）
     */
    async findAll(query: GetTodoDeletedListQuerySchemaType): Promise<TodoDeletedListItem[]> {
        const conditions = this.buildConditions(query);

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
            .leftJoin(this.parentTaskAlias, eq(taskTransaction.parentId, this.parentTaskAlias.id))
            .where(and(...conditions))
            .limit(GetTodoDeletedListRepository.LIMIT)
            .offset((query.page - 1) * GetTodoDeletedListRepository.LIMIT);
    }

    async count(query: GetTodoDeletedListQuerySchemaType): Promise<number> {
        const conditions = this.buildConditions(query);

        const [{ total }] = await this.db
            .select({ total: sql<number>`count(*)` })
            .from(taskTransaction)
            .leftJoin(frontUserMaster, eq(taskTransaction.userId, frontUserMaster.id))
            .leftJoin(this.parentTaskAlias, eq(taskTransaction.parentId, this.parentTaskAlias.id))
            .where(and(...conditions));

        return total;
    }

    private buildConditions(query: GetTodoDeletedListQuerySchemaType) {
        return [
            eq(taskTransaction.deleteFlg, true),
            eq(frontUserMaster.deleteFlg, false),
            or(
                isNull(taskTransaction.parentId),
                eq(this.parentTaskAlias.deleteFlg, false),
            ),
            ...(query.userId ? [eq(taskTransaction.userId, query.userId)] : []),
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
