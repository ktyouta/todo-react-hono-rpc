import { Hono } from "hono";
import { API_ENDPOINT, HTTP_STATUS } from "../../../constant";
import { authMiddleware } from "../../../middleware";
import type { AppEnv } from "../../../types";
import { GetTodoStatsResponseDto } from "../dto/get-todo-stats-response.dto";
import { GetTodoStatsRepository } from "../repository/get-todo-stats.repository";
import { GetTodoStatsService } from "../service/get-todo-stats.service";

/**
 * タスク集計取得
 * @route GET /api/v1/todo/stats
 */
const getTodoStats = new Hono<AppEnv>().get(
  API_ENDPOINT.TODO_STATS,
  authMiddleware,
  async (c) => {
    const db = c.get("db");
    const repository = new GetTodoStatsRepository(db);
    const service = new GetTodoStatsService(repository);
    const userId = c.get("user")?.userId;

    if (!userId) {
      return c.json({ message: "認証エラー" }, HTTP_STATUS.UNAUTHORIZED);
    }

    const todoStats = await service.find(userId);
    const dto = new GetTodoStatsResponseDto(todoStats);

    return c.json({ message: "タスク集計を取得しました。", data: dto.value }, HTTP_STATUS.OK);
  }
);

export { getTodoStats };
