import { and, eq, gte, like, lte, sql } from "drizzle-orm";
import { FLG } from "../../../constant";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, frontUserMaster, priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import { GetTodoManagementListQuerySchemaType } from "../schema/get-todo-management-list-query.schema";
import type { IGetTodoManagementListRepository, TodoManagementListItem } from "./get-todo-management-list.repository.interface";

/**
 * タスク一覧取得リポジトリ実装（管理者用）
 */
export class GetTodoManagementListRepository implements IGetTodoManagementListRepository {

    // 最大取得件数
    static readonly LIMIT = 30;

    constructor(private readonly db: Database) { }

    /**
     * 全件取得（全ユーザー対象）
     */
    async findAll(query: GetTodoManagementListQuerySchemaType): Promise<TodoManagementListItem[]> {
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
            })
            .from(taskTransaction)
            .leftJoin(categoryMaster, eq(taskTransaction.categoryId, categoryMaster.id))
            .leftJoin(statusMaster, eq(taskTransaction.statusId, statusMaster.id))
            .leftJoin(priorityMaster, eq(taskTransaction.priorityId, priorityMaster.id))
            .leftJoin(frontUserMaster, eq(taskTransaction.userId, frontUserMaster.id))
            .where(and(...conditions))
            .limit(GetTodoManagementListRepository.LIMIT)
            .offset((query.page - 1) * GetTodoManagementListRepository.LIMIT);
    }

    async count(query: GetTodoManagementListQuerySchemaType): Promise<number> {
        const conditions = this.buildConditions(query);

        const [{ total }] = await this.db
            .select({ total: sql<number>`count(*)` })
            .from(taskTransaction)
            .where(and(...conditions));

        return total;
    }

    private buildConditions(query: GetTodoManagementListQuerySchemaType) {
        return [
            eq(taskTransaction.deleteFlg, FLG.OFF),
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
