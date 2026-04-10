import { FrontUserId } from "../../../domain";
import type { IGetTodoStatsRepository, TodoStats } from "../repository/get-todo-stats.repository.interface";

/**
 * タスク集計取得サービス
 */
export class GetTodoStatsService {
  constructor(private readonly repository: IGetTodoStatsRepository) {}

  /**
   * 集計取得
   */
  async find(userId: FrontUserId): Promise<TodoStats> {
    return await this.repository.find(userId);
  }
}
