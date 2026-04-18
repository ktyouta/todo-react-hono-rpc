import { and, eq, sql } from "drizzle-orm";
import { TaskId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import { GetTodoDeletedSubtaskListQuerySchemaType } from "../schema/get-todo-deleted-subtask-list-query.schema";
import type { DeletedSubtaskListItem, IGetTodoDeletedSubtaskListRepository } from "./get-todo-deleted-subtask-list.repository.interface";

/**
 * 削除タスク管理サブタスク一覧取得リポジトリ実装（管理者用）
 */
export class GetTodoDeletedSubtaskListRepository implements IGetTodoDeletedSubtaskListRepository {

    // 最大取得件数
    static readonly LIMIT = 10;

    constructor(private readonly db: Database) { }

    /**
     * サブタスク一覧取得（deleteFlg問わず）
     */
    async findAll(parentTaskId: TaskId, query: GetTodoDeletedSubtaskListQuerySchemaType): Promise<DeletedSubtaskListItem[]> {
        return await this.db
            .select({
                id: taskTransaction.id,
                title: taskTransaction.title,
                statusId: taskTransaction.statusId,
                statusName: sql<string>`coalesce(${statusMaster.name}, 'なし')`,
                priorityId: taskTransaction.priorityId,
                priorityName: sql<string>`coalesce(${priorityMaster.name}, 'なし')`,
                dueDate: taskTransaction.dueDate,
                deleteFlg: taskTransaction.deleteFlg,
            })
            .from(taskTransaction)
            .leftJoin(statusMaster, eq(taskTransaction.statusId, statusMaster.id))
            .leftJoin(priorityMaster, eq(taskTransaction.priorityId, priorityMaster.id))
            .where(
                eq(taskTransaction.parentId, parentTaskId.value)
            )
            .limit(GetTodoDeletedSubtaskListRepository.LIMIT)
            .offset((query.page - 1) * GetTodoDeletedSubtaskListRepository.LIMIT);
    }

    /**
     * サブタスク件数取得
     */
    async count(parentTaskId: TaskId): Promise<number> {
        const [{ total }] = await this.db
            .select({ total: sql<number>`count(*)` })
            .from(taskTransaction)
            .where(
                eq(taskTransaction.parentId, parentTaskId.value)
            );

        return total;
    }
}
