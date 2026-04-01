import type { PermissionId, RoleName } from "../../../domain";

export type RoleItem = {
    id: number;
    name: string;
    isProtected: boolean;
};

export interface IUpdateRoleManagementRepository {
    findById(roleId: number): Promise<RoleItem | undefined>;
    findByNameExcludingId(roleName: RoleName, excludeRoleId: number): Promise<{ id: number }[]>;
    findMissingProtectedPermissions(permissionIds: PermissionId[]): Promise<{ id: number }[]>;
}
