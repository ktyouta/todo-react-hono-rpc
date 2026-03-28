import type { GetUserDeletedListQuerySchemaType } from "../schema/get-user-deleted-list-query.schema";
import type { UserDeletedDetail } from "./get-user-deleted.repository.interface";

export type UserDeletedListItem = UserDeletedDetail;

export type UserDeletedListResult = {
    list: UserDeletedListItem[];
    total: number;
};

export interface IGetUserDeletedListRepository {
    findAll(query: GetUserDeletedListQuerySchemaType): Promise<UserDeletedListItem[]>;
    count(query: GetUserDeletedListQuerySchemaType): Promise<number>;
}
