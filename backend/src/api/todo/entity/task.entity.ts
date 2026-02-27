import { TaskContent } from "src/domain/task-content";
import { TaskTitle } from "src/domain/task-title";

/**
 * タスクエンティティ
 */
export class TaskEntity {
    private readonly _taskTitle: TaskTitle;
    private readonly _taskContent: TaskContent;

    constructor(
        taskTitle: TaskTitle,
        taskContent: TaskContent,
    ) {
        this._taskTitle = taskTitle;
        this._taskContent = taskContent;
    }

    get taskTitle() {
        return this._taskTitle.value;
    }

    get taskContent() {
        return this._taskContent.value;
    }
}
