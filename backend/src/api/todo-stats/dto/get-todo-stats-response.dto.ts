import type { TodoStats } from "../repository/get-todo-stats.repository.interface";

/**
 * タスク集計レスポンスの型
 */
export type GetTodoStatsResponseType = {
  overdue: number;
  dueToday: number;
  dueSoon: number;
  overdueList: { id: number; title: string; dueDate: string }[];
  dueTodayList: { id: number; title: string; dueDate: string }[];
  dueSoonList: { id: number; title: string; dueDate: string }[];
  byStatus: { notStarted: number; inProgress: number; done: number };
  byPriority: { high: number; medium: number; low: number };
  favorites: number;
  trash: number;
  tasks: number;
  subTasks: number;
  memos: number;
  noDueDate: number;
  noPriority: number;
  total: number;
};

/**
 * タスク集計レスポンスDTO
 */
export class GetTodoStatsResponseDto {
  private readonly _value: GetTodoStatsResponseType;

  constructor(todoStats: TodoStats) {
    const row = todoStats.stats;
    this._value = {
      overdue: row.overdue,
      dueToday: row.dueToday,
      dueSoon: row.dueSoon,
      overdueList: todoStats.overdueList.map((t) => ({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate ?? '',
      })),
      dueTodayList: todoStats.dueTodayList.map((t) => ({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate ?? '',
      })),
      dueSoonList: todoStats.dueSoonList.map((t) => ({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate ?? '',
      })),
      byStatus: {
        notStarted: row.notStarted,
        inProgress: row.inProgress,
        done: row.done,
      },
      byPriority: {
        high: row.highPriority,
        medium: row.mediumPriority,
        low: row.lowPriority,
      },
      favorites: row.favorites,
      trash: row.trash,
      tasks: row.tasks,
      subTasks: row.subTasks,
      memos: row.memos,
      noDueDate: row.noDueDate,
      noPriority: row.noPriority,
      total: row.total,
    };
  }

  get value(): GetTodoStatsResponseType {
    return this._value;
  }
}
