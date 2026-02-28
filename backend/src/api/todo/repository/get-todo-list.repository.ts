import { and, eq } from "drizzle-orm";
import { FLG } from "../../../constant";
import { FrontUserId } from "../../../domain";
import type { Database, TaskTransaction } from "../../../infrastructure/db";
import { taskTransaction } from "../../../infrastructure/db";
import type { IGetTodoListRepository } from "./get-todo-list.repository.interface";

/**
 * タスク一覧取得リポジトリ実装
 */
export class GetTodoListRepository implements IGetTodoListRepository {
  constructor(private readonly db: Database) { }

  /**
   * 全件取得
   */
  async findAll(userId: FrontUserId): Promise<TaskTransaction[]> {
    return await this.db
      .select()
      .from(taskTransaction)
      .where(
        and(
          eq(taskTransaction.deleteFlg, FLG.OFF),
          eq(taskTransaction.userId, userId.value)
        )
      );
  }
}
