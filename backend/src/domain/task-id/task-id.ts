export class TaskId {

    private readonly _value: number;

    constructor(id: number) {

        if (!id) {
            throw Error(`タスクIDが存在しません。`);
        }

        this._value = id;
    }

    get value() {
        return this._value;
    }
}