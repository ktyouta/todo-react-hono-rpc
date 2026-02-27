import { TaskEntity } from "../entity/task.entity";

/**
 * タスク作成レスポンスの型
 */
export type CreateTodoResponseType = {
  title: string;
  content: string;
};

/**
 * タスク作成レスポンスDTO
 */
export class CreateFrontUserResponseDto {
  private readonly _value: CreateTodoResponseType;

  constructor(entity: TaskEntity) {
    this._value = {
      title: entity.taskTitle,
      content: entity.taskContent,
    };
  }

  get value() {
    return this._value;
  }
}
