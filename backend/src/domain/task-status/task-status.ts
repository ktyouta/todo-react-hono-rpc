export enum StatusType {
    notStarted = 1,
    inProgress = 2,
    completed = 3,
}

export class TaskStatus {

    // ステータス
    private readonly _value: StatusType | null;

    constructor(status: number | undefined) {

        if (!status) {
            this._value = null;
            return;
        }

        let value = status;
        if (!Object.values(StatusType).includes(value)) {
            value = StatusType.notStarted;
        }

        this._value = value;
    }

    get value() {
        return this._value;
    }
}