import type { GetUserDeletedListQuerySchemaType } from "../schema/get-user-deleted-list-query.schema";

export type UserDeletedListItem = {
    id: number;
    name: string;
    birthday: string;
    roleId: number;
    roleName: string;
    lastLoginDate: string | null;
    createdAt: string;
    updatedAt: string;
};

export type UserDeletedListResult = {
    list: UserDeletedListItem[];
    total: number;
};

export interface IGetUserDeletedListRepository {
    findAll(query: GetUserDeletedListQuerySchemaType): Promise<UserDeletedListItem[]>;
    count(query: GetUserDeletedListQuerySchemaType): Promise<number>;
}
