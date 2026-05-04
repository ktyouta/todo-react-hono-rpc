import { TaskId } from "../../../domain/task-id";
import type { IGetTodoManagementRepository } from "../repository/get-todo-management.repository.interface";

/**
 * タスク取得サービス（管理者用）
 */
export class GetTodoManagementService {
    constructor(private readonly repository: IGetTodoManagementRepository) { }

    /**
     * タスク取得
     */
    async find(taskId: TaskId) {
        return this.repository.find(taskId);
    }

    /**
     * 祖先タスク取得
     */
    async findAncestors(parentId: number) {
        return this.repository.findAncestors(parentId);
    }
}
