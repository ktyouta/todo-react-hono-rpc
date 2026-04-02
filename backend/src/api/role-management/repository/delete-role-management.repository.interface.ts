
export type RoleItem = {
    id: number;
    name: string;
    isProtected: boolean;
    isImmutable: boolean;
};

export interface IDeleteRoleManagementRepository {
    findById(roleId: number): Promise<RoleItem | undefined>;
    checkExistUser(roleId: number): Promise<{ id: number }[]>;
}
