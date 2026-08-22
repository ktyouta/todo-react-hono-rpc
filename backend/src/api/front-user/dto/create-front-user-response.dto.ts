import { FrontUserEntity } from "../entity";

/**
 * ユーザー作成レスポンスの型
 */
type CreateFrontUserResponseType = {
  accessToken: string;
  user: {
    id: number;
    name: string;
    birthday: string;
    role: string;
    darkMode: boolean;
    permissions: string[];
  };
};

/**
 * ユーザー作成レスポンスDTO
 */
export class CreateFrontUserResponseDto {
  private readonly _value: CreateFrontUserResponseType;

  constructor(entity: FrontUserEntity, accessToken: string, role: string, permissions: string[]) {
    this._value = {
      accessToken,
      user: {
        id: entity.frontUserId,
        name: entity.frontUserName,
        birthday: entity.frontUserBirthday,
        role,
        // 新規作成直後はスキーマのデフォルト値（false）で固定
        darkMode: false,
        permissions,
      },
    };
  }

  get value(): CreateFrontUserResponseType {
    return this._value;
  }
}
