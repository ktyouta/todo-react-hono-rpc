export type UserListItem = {
    id: number;
    name: string;
};

export interface IGetUserListRepository {
    findAll(): Promise<UserListItem[]>;
}
