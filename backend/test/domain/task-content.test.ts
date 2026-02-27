import { TaskContent } from "src/domain";
import { describe, expect, it } from "vitest";

describe("TaskContent", () => {

    it("有効な内容でインスタンスを生成できる", () => {
        const content = new TaskContent("タスク内容");
        expect(content.value).toBe("タスク内容");
    });

    it("value が渡した内容をそのまま返す", () => {
        const text = "買い物をする";
        const content = new TaskContent(text);
        expect(content.value).toBe(text);
    });

    it("空文字のとき Error を throw する", () => {
        expect(() => new TaskContent("")).toThrow("タスク内容が存在しません。");
    });
});
