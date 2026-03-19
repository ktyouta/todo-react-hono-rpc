import type { UserWithRole } from "../repository/front-user-login.repository.interface";

/**
 * ログインレスポンスの型
 */
export type FrontUserLoginResponseType = {
  accessToken: string;
  user: {
    id: number;
    name: string;
    birthday: string;
    role: string;
    permissions: string[];
  };
};

/**
 * ログインレスポンスDTO
 */
export class FrontUserLoginResponseDto {
  private readonly _value: FrontUserLoginResponseType;

  constructor(userInfo: UserWithRole, permissions: string[], accessToken: string) {
    this._value = {
      accessToken,
      user: {
        id: userInfo.id,
        name: userInfo.name,
        birthday: userInfo.birthday,
        role: userInfo.role,
        permissions,
      },
    };
  }

  get value(): FrontUserLoginResponseType {
    return this._value;
  }
}
