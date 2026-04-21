import { and, eq, gte, isNull, like, lte, sql } from "drizzle-orm";
import { FrontUserId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import { GetTodoExportQuerySchemaType } from "../schema/get-todo-export-query.schema";
import type { IGetTodoExportRepository, TodoExportItem } from "./get-todo-export.repository.interface";

/**
 * タスクCSVエクスポートリポジトリ実装
 */
export class GetTodoExportRepository implements IGetTodoExportRepository {
    constructor(private readonly db: Database) { }

    /**
     * エクスポート対象の全件取得（ページネーションなし）
     */
    async findAll(userId: FrontUserId, query: GetTodoExportQuerySchemaType): Promise<TodoExportItem[]> {
        const conditions = this.buildConditions(userId, query);

        return await this.db
            .select({
                id: taskTransaction.id,
                title: taskTransaction.title,
                content: taskTransaction.content,
                categoryId: sql<string>`coalesce(${categoryMaster.id}, '')`,
                categoryName: sql<string>`coalesce(${categoryMaster.name}, '')`,
                statusId: sql<string>`coalesce(${statusMaster.id}, '')`,
                statusName: sql<string>`coalesce(${statusMaster.name}, 'なし')`,
                priorityId: sql<string>`coalesce(${priorityMaster.id}, '')`,
                priorityName: sql<string>`coalesce(${priorityMaster.name}, 'なし')`,
                dueDate: taskTransaction.dueDate,
                isFavorite: taskTransaction.isFavorite,
                createdAt: taskTransaction.createdAt,
                updatedAt: taskTransaction.updatedAt,
            })
            .from(taskTransaction)
            .leftJoin(categoryMaster, eq(taskTransaction.categoryId, categoryMaster.id))
            .leftJoin(statusMaster, eq(taskTransaction.statusId, statusMaster.id))
            .leftJoin(priorityMaster, eq(taskTransaction.priorityId, priorityMaster.id))
            .where(and(...conditions));
    }

    private buildConditions(userId: FrontUserId, query: GetTodoExportQuerySchemaType) {
        return [
            eq(taskTransaction.deleteFlg, false),
            eq(taskTransaction.userId, userId.value),
            isNull(taskTransaction.parentId),
            ...(query.title ? [like(taskTransaction.title, `%${query.title}%`)] : []),
            ...(query.categoryId ? [eq(taskTransaction.categoryId, query.categoryId)] : []),
            ...(query.statusId ? [eq(taskTransaction.statusId, query.statusId)] : []),
            ...(query.priorityId ? [eq(taskTransaction.priorityId, query.priorityId)] : []),
            ...(query.dueDateFrom ? [gte(taskTransaction.dueDate, query.dueDateFrom)] : []),
            ...(query.dueDateTo ? [lte(taskTransaction.dueDate, query.dueDateTo)] : []),
            ...(query.createdAtFrom ? [gte(taskTransaction.createdAt, query.createdAtFrom)] : []),
            ...(query.createdAtTo ? [lte(taskTransaction.createdAt, query.createdAtTo)] : []),
            ...(query.updatedAtFrom ? [gte(taskTransaction.updatedAt, query.updatedAtFrom)] : []),
            ...(query.updatedAtTo ? [lte(taskTransaction.updatedAt, query.updatedAtTo)] : []),
            ...(query.isFavorite ? [eq(taskTransaction.isFavorite, query.isFavorite)] : []),
        ];
    }
}
