import { CategoryType, StatusType } from "../../../domain";
import { TaskEntity } from "../entity/task.entity";

/**
 * タスク更新レスポンスの型
 */
export type UpdateTodoResponseType = {
  title: string;
  content: string | null;
  category: CategoryType;
  status: StatusType | null;
};

/**
 * タスク更新レスポンスDTO
 */
export class UpdateTodoResponseDto {
  private readonly _value: UpdateTodoResponseType;

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
