export enum TaskSortType {
    createdAtAsc = 1,
    createdAtDesc = 2,
    updatedAtAsc = 3,
    updatedAtDesc = 4,
    dueDateAsc = 5,
    dueDateDesc = 6,
    priorityAsc = 7,
    priorityDesc = 8,
}

export class TaskSort {

    // ソート条件
    private readonly _value: number | null;

    constructor(sort: number | undefined) {

        if (!sort) {
            this._value = null;
            return;
        }

        if (!Object.values(TaskSortType).includes(sort)) {
            this._value = null;
            return;
        }

        this._value = sort;
    }

    get value() {
        return this._value;
    }
}
