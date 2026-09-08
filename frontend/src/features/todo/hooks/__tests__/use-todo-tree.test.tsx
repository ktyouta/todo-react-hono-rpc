import { ThemeContext } from "@/app/components/theme-provider";
import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";
import { TodoTreeItemType } from "../../api/get-todo-tree";
import { useTodoTree } from "../use-todo-tree";

// react-router-dom のモック
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

// タスクID取得のモック
vi.mock("../use-task-id", () => ({
    useTaskId: () => "2",
}));

const mockItems: TodoTreeItemType[] = [
    { id: 1, title: "親タスク", parentId: null },
    { id: 2, title: "子タスク", parentId: 1 },
];

// タスクツリー取得のモック
vi.mock("../../api/get-todo-tree", () => ({
    useGetTodoTree: () => ({ data: { data: mockItems } }),
}));

function renderWithTheme(theme: "light" | "dark") {
    function wrapper({ children }: { children: ReactNode }) {
        return (
            <ThemeContext.Provider value={theme}>
                {children}
            </ThemeContext.Provider>
        );
    }
    return renderHook(() => useTodoTree(), { wrapper });
}

describe("useTodoTree", () => {

    describe("ノードの配色", () => {

        test("ダークモード時、非選択ノードの背景色は白固定ではない", () => {

            const { result } = renderWithTheme("dark");

            const node = result.current.treeData.nodes.find((n) => n.id === "1");

            expect(node?.style?.background).not.toBe("#fff");
        });

        test("ダークモード時、非選択ノードの文字色が明示的に設定されている", () => {

            const { result } = renderWithTheme("dark");

            const node = result.current.treeData.nodes.find((n) => n.id === "1");

            expect(node?.style?.color).toBeDefined();
        });

        test("ライトモード時、非選択ノードの背景色は白のままである", () => {

            const { result } = renderWithTheme("light");

            const node = result.current.treeData.nodes.find((n) => n.id === "1");

            expect(node?.style?.background).toBe("#fff");
        });
    });
});
