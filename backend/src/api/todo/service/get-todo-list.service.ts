import { FrontUserId } from "../../../domain";
import { IGetTodoListRepository, TodoListResult } from "../repository/get-todo-list.repository.interface";
import { GetTodoListQuerySchemaType } from "../schema/get-todo-list-query.schema";

/**
 * タスク一覧取得サービス
 */
export class GetTodoListService {
  constructor(private readonly repository: IGetTodoListRepository) { }

  /**
   * 全件取得
   */
  async findAll(userId: FrontUserId, query: GetTodoListQuerySchemaType): Promise<TodoListResult> {
    const [list, total] = await Promise.all([
      this.repository.findAll(userId, query),
      this.repository.count(userId, query),
    ]);
    return { list, total };
  }
}
