import type { FrontUserId } from "../../../domain";

export type UserDeletedDetail = {
    id: number;
    name: string;
    birthday: string;
    roleId: number;
    roleName: string;
    lastLoginDate: string | null;
    createdAt: string;
    updatedAt: string;
};

export interface IGetUserDeletedRepository {
    findById(userId: FrontUserId): Promise<UserDeletedDetail | undefined>;
}
