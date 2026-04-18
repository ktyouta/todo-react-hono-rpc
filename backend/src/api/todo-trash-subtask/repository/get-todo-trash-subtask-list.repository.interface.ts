import { FrontUserId, TaskId } from "../../../domain";
import { GetTodoTrashSubtaskListQuerySchemaType } from "../schema/get-todo-trash-subtask-list-query.schema";

export type TrashSubtaskListItem = {
    id: number;
    title: string;
    statusId: number | null;
    statusName: string;
    priorityId: number | null;
    priorityName: string;
    dueDate: string | null;
    deleteFlg: boolean;
    createdAt: string;
    updatedAt: string;
};

export type TrashSubtaskListResult = {
    list: TrashSubtaskListItem[];
    total: number;
};

/**
 * ゴミ箱サブタスク一覧取得リポジトリインターフェース（一般ユーザー用）
 */
export interface IGetTodoTrashSubtaskListRepository {
    /**
     * サブタスク一覧取得（deleteFlg問わず）
     */
    findAll(userId: FrontUserId, parentTaskId: TaskId, query: GetTodoTrashSubtaskListQuerySchemaType): Promise<TrashSubtaskListItem[]>;
    /**
     * サブタスク件数取得
     */
    count(userId: FrontUserId, parentTaskId: TaskId): Promise<number>;
}
