export interface ICreateRoleManagementRepository {
    findByName(name: string): Promise<{ id: number }[]>;
    getNextSeqId(): Promise<number | null>;
}
