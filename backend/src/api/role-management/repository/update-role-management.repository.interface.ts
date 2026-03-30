export interface IUpdateRoleManagementRepository {
    findById(roleId: number): Promise<{ id: number } | undefined>;
    findByNameExcludingId(name: string, excludeRoleId: number): Promise<{ id: number }[]>;
}
