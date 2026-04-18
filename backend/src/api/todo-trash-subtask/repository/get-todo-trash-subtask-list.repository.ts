import { and, eq, sql } from "drizzle-orm";
import { FrontUserId, TaskId } from "../../../domain";
import type { Database } from "../../../infrastructure/db";
import { priorityMaster, statusMaster, taskTransaction } from "../../../infrastructure/db";
import { GetTodoTrashSubtaskListQuerySchemaType } from "../schema/get-todo-trash-subtask-list-query.schema";
import type { IGetTodoTrashSubtaskListRepository, TrashSubtaskListItem } from "./get-todo-trash-subtask-list.repository.interface";

/**
 * ゴミ箱サブタスク一覧取得リポジトリ実装（一般ユーザー用）
 */
export class GetTodoTrashSubtaskListRepository implements IGetTodoTrashSubtaskListRepository {

    // 最大取得件数
    static readonly LIMIT = 10;

    constructor(private readonly db: Database) { }

    /**
     * サブタスク一覧取得（deleteFlg問わず）
     */
    async findAll(userId: FrontUserId, parentTaskId: TaskId, query: GetTodoTrashSubtaskListQuerySchemaType): Promise<TrashSubtaskListItem[]> {
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
                createdAt: taskTransaction.createdAt,
                updatedAt: taskTransaction.updatedAt,
            })
            .from(taskTransaction)
            .leftJoin(statusMaster, eq(taskTransaction.statusId, statusMaster.id))
            .leftJoin(priorityMaster, eq(taskTransaction.priorityId, priorityMaster.id))
            .where(
                and(
                    eq(taskTransaction.userId, userId.value),
                    eq(taskTransaction.parentId, parentTaskId.value),
                )
            )
            .limit(GetTodoTrashSubtaskListRepository.LIMIT)
            .offset((query.page - 1) * GetTodoTrashSubtaskListRepository.LIMIT);
    }

    /**
     * サブタスク件数取得
     */
    async count(userId: FrontUserId, parentTaskId: TaskId): Promise<number> {
        const [{ total }] = await this.db
            .select({ total: sql<number>`count(*)` })
            .from(taskTransaction)
            .where(
                and(
                    eq(taskTransaction.userId, userId.value),
                    eq(taskTransaction.parentId, parentTaskId.value),
                )
            );

        return total;
    }
}
