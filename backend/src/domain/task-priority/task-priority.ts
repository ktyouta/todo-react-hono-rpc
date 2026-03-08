export enum PriorityType {
    low = 1,
    medium = 2,
    high = 3,
}

export class TaskPriority {

    // 優先度
    private readonly _value: PriorityType | null;

    constructor(priority: number | undefined) {

        if (!priority) {
            this._value = null;
            return;
        }

        let value = priority;
        if (!Object.values(PriorityType).includes(value)) {
            value = PriorityType.low;
        }

        this._value = value;
    }

    get value() {
        return this._value;
    }
}