import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { TodoCreatePage } from "../todo-create-page";

// データ取得中の状態を再現するため、実際のコンテナをサスペンドしたままにするモックに差し替える
vi.mock("../create-todo-container", () => ({
    TodoCreateContainer: () => {
        throw new Promise(() => { });
    },
}));

describe("TodoCreatePage", () => {
    test("データ取得中はfullScreenを指定しないLoadingフォールバックが表示される", () => {
        const { container } = render(<TodoCreatePage />);

        const loadingRoot = container.firstChild as HTMLElement;
        expect(loadingRoot).not.toHaveClass("w-screen");
        expect(loadingRoot).not.toHaveClass("h-screen");
    });
});
