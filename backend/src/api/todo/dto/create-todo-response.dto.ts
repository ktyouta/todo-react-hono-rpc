import { CategoryType, StatusType } from "../../../domain";
import { TaskEntity } from "../entity/task.entity";

/**
 * タスク作成レスポンスの型
 */
export type CreateTodoResponseType = {
  title: string;
  content: string | null;
  category: CategoryType;
  status: StatusType | null;
};

/**
 * タスク作成レスポンスDTO
 */
export class CreateTodoResponseDto {
  private readonly _value: CreateTodoResponseType;

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
