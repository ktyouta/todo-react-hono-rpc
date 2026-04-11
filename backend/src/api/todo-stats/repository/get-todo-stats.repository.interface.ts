import { FrontUserId } from "../../../domain";

export type TodoStatsListItem = {
  id: number;
  title: string;
  dueDate: string;
};

export type TodoStats = {
  overdue: number;
  dueToday: number;
  overdueList: TodoStatsListItem[];
  dueTodayList: TodoStatsListItem[];
  byStatus: {
    notStarted: number;
    inProgress: number;
    done: number;
  };
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  favorites: number;
  trash: number;
  memos: number;
};

/**
 * タスク集計取得リポジトリインターフェース
 */
export interface IGetTodoStatsRepository {
  /**
   * 集計取得
   */
  find(userId: FrontUserId): Promise<TodoStats>;
}
