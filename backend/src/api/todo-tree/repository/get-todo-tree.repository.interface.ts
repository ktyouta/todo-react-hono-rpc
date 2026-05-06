export type TodoTreeItem = {
  id: number;
  title: string;
  parentId: number | null;
};

/**
 * タスクツリー取得リポジトリインターフェース
 */
export interface IGetTodoTreeRepository {
  /**
   * 指定タスクが属するツリーの全ノードを取得（ルートから全子孫）
   */
  findTree(userId: number, taskId: number): Promise<TodoTreeItem[]>;
}
