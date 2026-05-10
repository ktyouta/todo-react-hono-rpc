export type TodoManagementTreeItem = {
  id: number;
  title: string;
  parentId: number | null;
};

/**
 * タスクツリー取得リポジトリインターフェース（管理者用）
 */
export interface IGetTodoManagementTreeRepository {
  /**
   * 指定タスクが属するツリーの全ノードを取得（ルートから全子孫）
   */
  findTree(taskId: number): Promise<TodoManagementTreeItem[]>;
}
