import { TaskId } from "../../../domain/task-id";

export type UpdateTodoManagementParentItem = {
  parentId: number | null;
};

/**
 * タスク更新（管理者用）リポジトリインターフェース
 */
export interface IUpdateTodoManagementRepository {
  /**
   * 更新対象タスクの親タスクIDを取得
   */
  findParentId(taskId: TaskId): Promise<UpdateTodoManagementParentItem | undefined>;
  /**
   * 祖先タスクID一覧を取得（親タスク自身からルートまで）
   */
  findAncestorIds(parentId: number): Promise<number[]>;
}
