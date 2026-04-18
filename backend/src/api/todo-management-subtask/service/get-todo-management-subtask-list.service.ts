import { TaskId } from "../../../domain";
import { GetTodoManagementSubtaskListQuerySchemaType } from "../schema/get-todo-management-subtask-list-query.schema";
import type { IGetTodoManagementSubtaskListRepository, ManagementSubtaskListResult } from "../repository/get-todo-management-subtask-list.repository.interface";

/**
 * サブタスク一覧取得サービス（管理者用）
 */
export class GetTodoManagementSubtaskListService {
  constructor(private readonly repository: IGetTodoManagementSubtaskListRepository) { }

  /**
   * サブタスク一覧取得
   */
  async findAll(parentTaskId: TaskId, query: GetTodoManagementSubtaskListQuerySchemaType): Promise<ManagementSubtaskListResult> {
    const [list, total] = await Promise.all([
      this.repository.findAll(parentTaskId, query),
      this.repository.count(parentTaskId),
    ]);
    return { list, total };
  }
}
