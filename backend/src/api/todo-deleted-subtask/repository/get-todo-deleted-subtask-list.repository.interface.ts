import { TaskId } from "../../../domain";
import { GetTodoDeletedSubtaskListQuerySchemaType } from "../schema/get-todo-deleted-subtask-list-query.schema";

export type DeletedSubtaskListItem = {
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

export type DeletedSubtaskListResult = {
    list: DeletedSubtaskListItem[];
    total: number;
};

/**
 * 削除タスク管理サブタスク一覧取得リポジトリインターフェース（管理者用）
 */
export interface IGetTodoDeletedSubtaskListRepository {
    /**
     * サブタスク一覧取得（deleteFlg問わず）
     */
    findAll(parentTaskId: TaskId, query: GetTodoDeletedSubtaskListQuerySchemaType): Promise<DeletedSubtaskListItem[]>;
    /**
     * サブタスク件数取得
     */
    count(parentTaskId: TaskId): Promise<number>;
}
