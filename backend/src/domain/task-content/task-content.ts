export class TaskContent {

    // タスク内容
    private readonly _value: string | null;

    constructor(content: string | undefined) {
        this._value = content || null;
    }

    get value() {
        return this._value;
    }
}