import { CategoryType, StatusType } from "../../../domain";
import { TaskEntity } from "../entity/task.entity";

/**
 * タスク更新レスポンスの型（管理者用）
 */
export type UpdateTodoManagementResponseType = {
    title: string;
    content: string | null;
    category: CategoryType;
    status: StatusType | null;
};

/**
 * タスク更新レスポンスDTO（管理者用）
 */
export class UpdateTodoManagementResponseDto {
    private readonly _value: UpdateTodoManagementResponseType;

    constructor(entity: TaskEntity) {
        this._value = {
            title: entity.taskTitle,
            content: entity.taskContent,
            category: entity.category,
            status: entity.status,
        };
    }

    get value() {
        return this._value;
    }
}
