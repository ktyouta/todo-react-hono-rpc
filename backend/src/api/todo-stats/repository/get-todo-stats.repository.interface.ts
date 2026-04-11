import { FrontUserId } from "../../../domain";

export type TodoStatsListItem = {
  id: number;
  title: string;
  dueDate: string | null;
};

export type StatType = {
  overdue: number;
  dueToday: number;
  dueSoon: number;
  notStarted: number;
  inProgress: number;
  done: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  favorites: number;
  trash: number;
  memos: number;
  noDueDate: number;
  noPriority: number;
  total: number;
}

export type TodoStats = {
  stats: StatType;
  overdueList: TodoStatsListItem[];
  dueTodayList: TodoStatsListItem[];
  dueSoonList: TodoStatsListItem[];
}

/**
 * タスク集計取得リポジトリインターフェース
 */
export interface IGetTodoStatsRepository {
  /**
   * 集計取得
   */
  find(userId: FrontUserId): Promise<TodoStats>;
}
