import { and, eq, gte, isNull, like, lte, sql } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, frontUserMaster, priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import { GetTodoManagementExportQuerySchemaType } from "../schema/get-todo-management-export-query.schema";
import type { IGetTodoManagementExportRepository, TodoManagementExportItem } from "./get-todo-management-export.repository.interface";

/**
 * タスク管理CSVエクスポートリポジトリ実装（管理者用）
 */
export class GetTodoManagementExportRepository implements IGetTodoManagementExportRepository {
    constructor(private readonly db: Database) { }

    /**
     * エクスポート対象の全件取得（ページネーションなし）
     */
    async findAll(query: GetTodoManagementExportQuerySchemaType): Promise<TodoManagementExportItem[]> {
        const conditions = this.buildConditions(query);

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
                userId: taskTransaction.userId,
                userName: sql<string>`coalesce(${frontUserMaster.name}, '')`,
                createdAt: taskTransaction.createdAt,
                updatedAt: taskTransaction.updatedAt,
            })
            .from(taskTransaction)
            .leftJoin(categoryMaster, eq(taskTransaction.categoryId, categoryMaster.id))
            .leftJoin(statusMaster, eq(taskTransaction.statusId, statusMaster.id))
            .leftJoin(priorityMaster, eq(taskTransaction.priorityId, priorityMaster.id))
            .leftJoin(frontUserMaster, eq(taskTransaction.userId, frontUserMaster.id))
            .where(and(...conditions));
    }

    private buildConditions(query: GetTodoManagementExportQuerySchemaType) {
        return [
            eq(taskTransaction.deleteFlg, false),
            isNull(taskTransaction.parentId),
            ...(query.userId ? [eq(taskTransaction.userId, query.userId)] : []),
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
        ];
    }
}
