import { TaskCategory } from "../../../domain/task-category";
import { TaskContent } from "../../../domain/task-content";
import { TaskPriority } from "../../../domain/task-priority";
import { TaskStatus } from "../../../domain/task-status";
import { TaskTitle } from "../../../domain/task-title";

/**
 * タスクエンティティ
 */
export class TaskEntity {
    private readonly _taskTitle: TaskTitle;
    private readonly _taskContent: TaskContent;
    private readonly _taskCategory: TaskCategory;
    private readonly _taskStatus: TaskStatus;
    private readonly _taskPriority: TaskPriority;

    constructor(
        taskTitle: TaskTitle,
        taskContent: TaskContent,
        taskCategory: TaskCategory,
        taskStatus: TaskStatus,
        taskPriority: TaskPriority,
    ) {
        this._taskTitle = taskTitle;
        this._taskContent = taskContent;
        this._taskCategory = taskCategory;
        this._taskStatus = taskStatus;
        this._taskPriority = taskPriority;
    }

    get taskTitle() {
        return this._taskTitle.value;
    }

    get taskContent() {
        return this._taskContent.value;
    }

    get category() {
        return this._taskCategory.value;
    }

    get status() {
        return this._taskStatus.value;
    }

    get priority() {
        return this._taskPriority.value;
    }
}
