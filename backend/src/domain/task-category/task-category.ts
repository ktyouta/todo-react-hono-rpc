enum CategoryType {
    task = 1,
    memo = 2,
}

export class TaskCategory {

    // カテゴリ
    private readonly _value: CategoryType;

    constructor(category: number) {

        let value = category;
        if (!Object.values(CategoryType).includes(value)) {
            value = CategoryType.task;
        }

        this._value = value;
    }

    get value() {
        return this._value;
    }
}