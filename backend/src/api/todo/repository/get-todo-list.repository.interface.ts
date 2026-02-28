import { FrontUserId } from "src/domain";
import type { TaskTransaction } from "../../../infrastructure/db";

/**
 * タスク一覧取得リポジトリインターフェース
 */
export interface IGetTodoListRepository {
  /**
   * 全件取得
   */
  findAll(userId: FrontUserId): Promise<TaskTransaction[]>;
}
