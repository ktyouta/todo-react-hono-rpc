import type { RoleManagementItem } from "./get-role-management-list.repository.interface";

export interface IGetRoleManagementRepository {
    findById(roleId: number): Promise<RoleManagementItem | undefined>;
}
