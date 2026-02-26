export class TaskContent {

    // タスク内容
    private readonly _value: string;

    constructor(content: string) {

        if (!content) {
            throw Error(`タスク内容が存在しません。`);
        }

        this._value = content;
    }

    get value() {
        return this._value;
    }
}