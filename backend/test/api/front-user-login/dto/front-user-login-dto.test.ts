import { describe, it, expect } from "vitest";
import { FrontUserLoginResponseDto } from "../../../../src/api/front-user-login/dto";
import type { UserWithRole } from "../../../../src/api/front-user-login/repository/front-user-login.repository.interface";

describe("FrontUserLoginResponseDto", () => {
  it("ユーザー情報からDTOを生成できること", () => {
    const userInfo: UserWithRole = {
      id: 1,
      name: "testuser",
      birthday: "19900101",
      roleId: 1,
      role: "user",
    };
    const accessToken = "test-access-token";

    const dto = new FrontUserLoginResponseDto(userInfo, ["todo"], accessToken);

    expect(dto.value.accessToken).toBe("test-access-token");
    expect(dto.value.user.id).toBe(1);
    expect(dto.value.user.name).toBe("testuser");
    expect(dto.value.user.birthday).toBe("19900101");
  });

  it("lastLoginDateがnullでもDTOを生成できること", () => {
    const userInfo: UserWithRole = {
      id: 2,
      name: "newuser",
      birthday: "19950515",
      roleId: 1,
      role: "user",
    };
    const accessToken = "another-access-token";

    const dto = new FrontUserLoginResponseDto(userInfo, ["todo"], accessToken);

    expect(dto.value.accessToken).toBe("another-access-token");
    expect(dto.value.user.id).toBe(2);
    expect(dto.value.user.name).toBe("newuser");
    expect(dto.value.user.birthday).toBe("19950515");
  });
});
