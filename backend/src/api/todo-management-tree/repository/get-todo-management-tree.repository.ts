import { sql } from "drizzle-orm";
import type { Database } from "../../../infrastructure/db";
import { IGetTodoManagementTreeRepository, TodoManagementTreeItem } from "./get-todo-management-tree.repository.interface";

/**
 * タスクツリー取得リポジトリ実装（管理者用）
 *
 * 管理者は全ユーザーのタスクを参照できるため user_id 条件なし
 */
export class GetTodoManagementTreeRepository implements IGetTodoManagementTreeRepository {
  constructor(private readonly db: Database) { }

  /**
   * 指定タスクが属するツリーの全ノードを取得（ルートから全子孫）
   *
   * root_cte: 指定IDから上方向に辿ってルートを特定する
   * tree_cte: ルートIDから下方向に辿って全子孫を取得する
   */
  async findTree(taskId: number): Promise<TodoManagementTreeItem[]> {
    return this.db.all<TodoManagementTreeItem>(sql`
      WITH RECURSIVE
        root_cte(id, parent_id) AS (
          SELECT id, parent_id
          FROM task_transaction
          WHERE id = ${taskId}
            AND delete_flg = 0
          UNION ALL
          SELECT t.id, t.parent_id
          FROM task_transaction t
          INNER JOIN root_cte r ON t.id = r.parent_id
          WHERE t.delete_flg = 0
        ),
        tree_cte(id, title, parent_id) AS (
          SELECT id, title, parent_id
          FROM task_transaction
          WHERE id = (SELECT id FROM root_cte WHERE parent_id IS NULL)
            AND delete_flg = 0
          UNION ALL
          SELECT t.id, t.title, t.parent_id
          FROM task_transaction t
          INNER JOIN tree_cte tc ON t.parent_id = tc.id
          WHERE t.delete_flg = 0
        )
      SELECT id, title, parent_id AS parentId FROM tree_cte ORDER BY id
    `);
  }
}
