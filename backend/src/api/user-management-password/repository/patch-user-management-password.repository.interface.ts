import type { FrontUserId, FrontUserPassword } from "../../../domain";
import type { FrontUserLoginMaster } from "../../../infrastructure/db";

export interface IPatchUserManagementPasswordRepository {
    getLoginUser(userId: FrontUserId): Promise<FrontUserLoginMaster | undefined>;
    updatePassword(userId: FrontUserId, password: FrontUserPassword): Promise<boolean>;
}
