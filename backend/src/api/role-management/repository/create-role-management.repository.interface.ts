import type { RoleName } from "../../../domain";

export interface ICreateRoleManagementRepository {
    findByName(roleName: RoleName): Promise<{ id: number }[]>;
    getNextSeqId(): Promise<number | null>;
}
