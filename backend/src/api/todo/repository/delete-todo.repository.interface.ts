import { FrontUserId } from "../../../domain";
import { TaskId } from "../../../domain/task-id";

export type TodoItem = {
  isFavorite: boolean;
};

/**
 * タスク削除取得リポジトリインターフェース
 */
export interface IDeleteTodoRepository {
  /**
   * タスク取得
   */
  find(userId: FrontUserId, taskId: TaskId): Promise<TodoItem | undefined>;
}
