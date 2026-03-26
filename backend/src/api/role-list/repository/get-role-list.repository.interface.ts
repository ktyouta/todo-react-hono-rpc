export type RoleListItem = {
    id: number;
    name: string;
};

export interface IGetRoleListRepository {
    findAll(): Promise<RoleListItem[]>;
}
