import type { RoleName } from "../../../domain";

export interface IUpdateRoleManagementRepository {
    findById(roleId: number): Promise<{ id: number } | undefined>;
    findByNameExcludingId(roleName: RoleName, excludeRoleId: number): Promise<{ id: number }[]>;
}
