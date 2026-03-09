export class TaskDueDate {

    // 期限日（YYYY-MM-DD 形式、または null）
    private readonly _value: string | null;

    constructor(dueDate: string | null | undefined) {
        if (!dueDate) {
            this._value = null;
            return;
        }
        this._value = dueDate;
    }

    get value() {
        return this._value;
    }
}
