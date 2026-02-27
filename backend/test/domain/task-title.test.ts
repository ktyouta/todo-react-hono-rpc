import { TaskTitle } from "src/domain";
import { describe, expect, it } from "vitest";

describe("TaskTitle", () => {

    it("有効なタイトルでインスタンスを生成できる", () => {
        const title = new TaskTitle("タスクタイトル");
        expect(title.value).toBe("タスクタイトル");
    });

    it("value が渡したタイトルをそのまま返す", () => {
        const text = "買い物リスト";
        const title = new TaskTitle(text);
        expect(title.value).toBe(text);
    });

    it("空文字のとき Error を throw する", () => {
        expect(() => new TaskTitle("")).toThrow("タスクのタイトルが存在しません。");
    });
});
