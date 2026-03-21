import { and, eq, gte, like, lte, sql } from "drizzle-orm";
import { FrontUserId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import { GetTodoListQuerySchemaType } from "../schema/get-todo-list-query.schema";
import type { IGetTodoListRepository, TodoListItem } from "./get-todo-list.repository.interface";

/**
 * タスク一覧取得リポジトリ実装
 */
export class GetTodoListRepository implements IGetTodoListRepository {

  // 最大取得条件件数
  static readonly LIMIT = 30;
  constructor(private readonly db: Database) { }

  /**
   * 全件取得
   */
  async findAll(userId: FrontUserId, query: GetTodoListQuerySchemaType): Promise<TodoListItem[]> {

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
        isFavorite: taskTransaction.isFavorite,
        deleteFlg: taskTransaction.deleteFlg,
        createdAt: taskTransaction.createdAt,
        updatedAt: taskTransaction.updatedAt,
      })
      .from(taskTransaction)
      .leftJoin(categoryMaster, eq(taskTransaction.categoryId, categoryMaster.id))
      .leftJoin(statusMaster, eq(taskTransaction.statusId, statusMaster.id))
      .leftJoin(priorityMaster, eq(taskTransaction.priorityId, priorityMaster.id))
      .where(and(...conditions))
      .limit(GetTodoListRepository.LIMIT)
      .offset((query.page - 1) * GetTodoListRepository.LIMIT);
  }

  async count(userId: FrontUserId, query: GetTodoListQuerySchemaType): Promise<number> {

    const conditions = this.buildConditions(userId, query);

    const [{ total }] = await this.db
      .select({ total: sql<number>`count(*)` })
      .from(taskTransaction)
      .where(and(...conditions));

    return total;
  }

  private buildConditions(userId: FrontUserId, query: GetTodoListQuerySchemaType) {
    return [
      eq(taskTransaction.deleteFlg, false),
      eq(taskTransaction.userId, userId.value),
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
