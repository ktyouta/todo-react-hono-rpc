import { FrontUserId } from "../../../domain";
import { TaskId } from "../../../domain/task-id";

export type UpdateTodoParentItem = {
  parentId: number | null;
};

/**
 * タスク更新リポジトリインターフェース
 */
export interface IUpdateTodoRepository {
  /**
   * 更新対象タスクの親タスクIDを取得
   */
  findParentId(userId: FrontUserId, taskId: TaskId): Promise<UpdateTodoParentItem | undefined>;
  /**
   * 祖先タスクID一覧を取得（親タスク自身からルートまで）
   */
  findAncestorIds(parentId: number): Promise<number[]>;
}
