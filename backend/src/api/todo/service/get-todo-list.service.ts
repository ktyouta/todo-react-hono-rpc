import { FrontUserId } from "../../../domain";
import { TaskTransaction } from "../../../infrastructure";
import { IGetTodoListRepository } from "../repository/get-todo-list.repository.interface";

/**
 * タスク一覧取得サービス
 */
export class GetTodoListService {
  constructor(private readonly repository: IGetTodoListRepository) { }

  /**
   * 全件取得
   */
  async findAll(userId: FrontUserId): Promise<TaskTransaction[]> {
    const records = await this.repository.findAll(userId);
    return records;
  }
}
