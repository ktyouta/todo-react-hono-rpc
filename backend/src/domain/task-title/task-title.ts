export class TaskTitle {

    // タイトル
    private readonly _value: string;

    constructor(title: string) {

        if (!title) {
            throw Error(`タスクのタイトルが存在しません。`);
        }

        this._value = title;
    }

    get value() {
        return this._value;
    }
}