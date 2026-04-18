import { and, eq, sql } from "drizzle-orm";
import { TaskId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { categoryMaster, priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import { GetTodoManagementSubtaskListQuerySchemaType } from "../schema/get-todo-management-subtask-list-query.schema";
import type { IGetTodoManagementSubtaskListRepository, ManagementSubtaskListItem } from "./get-todo-management-subtask-list.repository.interface";

/**
 * サブタスク一覧取得リポジトリ実装（管理者用）
 */
export class GetTodoManagementSubtaskListRepository implements IGetTodoManagementSubtaskListRepository {

  static readonly LIMIT = 10;

  constructor(private readonly db: Database) { }

  /**
   * サブタスク一覧取得（ユーザーフィルタなし）
   */
  async findAll(parentTaskId: TaskId, query: GetTodoManagementSubtaskListQuerySchemaType): Promise<ManagementSubtaskListItem[]> {
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
        isFavorite: taskTransaction.isFavorite,
        deleteFlg: taskTransaction.deleteFlg,
        parentId: taskTransaction.parentId,
        createdAt: taskTransaction.createdAt,
        updatedAt: taskTransaction.updatedAt,
      })
      .from(taskTransaction)
      .leftJoin(categoryMaster, eq(taskTransaction.categoryId, categoryMaster.id))
      .leftJoin(statusMaster, eq(taskTransaction.statusId, statusMaster.id))
      .leftJoin(priorityMaster, eq(taskTransaction.priorityId, priorityMaster.id))
      .where(
        and(
          eq(taskTransaction.deleteFlg, false),
          eq(taskTransaction.parentId, parentTaskId.value),
        )
      )
      .limit(GetTodoManagementSubtaskListRepository.LIMIT)
      .offset((query.page - 1) * GetTodoManagementSubtaskListRepository.LIMIT);
  }

  /**
   * サブタスク件数取得
   */
  async count(parentTaskId: TaskId): Promise<number> {
    const [{ total }] = await this.db
      .select({ total: sql<number>`count(*)` })
      .from(taskTransaction)
      .where(
        and(
          eq(taskTransaction.deleteFlg, false),
          eq(taskTransaction.parentId, parentTaskId.value),
        )
      );
    return total;
  }
}
