import type { FrontUserId, RoleId } from "../../../domain";

export interface IPatchUserManagementRoleRepository {
    updateRole(userId: FrontUserId, roleId: RoleId): Promise<boolean>;
}
