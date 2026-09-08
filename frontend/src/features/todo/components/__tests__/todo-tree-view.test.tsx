import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { TodoTreeView } from "../todo-tree-view";

const mockReactFlow = vi.fn();
const mockBackground = vi.fn();

// @xyflow/react のモック（実際の描画には依存せず、各コンポーネントへ渡されるpropsのみ検証する）
vi.mock("@xyflow/react", () => ({
    ReactFlow: (props: React.PropsWithChildren<Record<string, unknown>>) => {
        mockReactFlow(props);
        return <div>{props.children}</div>;
    },
    Background: (props: Record<string, unknown>) => {
        mockBackground(props);
        return <div data-testid="background" />;
    },
    Controls: () => <div data-testid="controls" />,
    Panel: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

const emptyTreeData = { nodes: [], edges: [] };

describe("TodoTreeView", () => {

    describe("colorMode", () => {

        test("ダークモード時、ReactFlowにcolorMode=darkが渡される", () => {

            render(
                <TodoTreeView
                    treeData={emptyTreeData}
                    onNodeClick={() => { }}
                    onClickBack={() => { }}
                    theme="dark"
                />
            );

            expect(mockReactFlow).toHaveBeenCalledWith(
                expect.objectContaining({ colorMode: "dark" })
            );
        });

        test("ライトモード時、ReactFlowにcolorMode=lightが渡される", () => {

            render(
                <TodoTreeView
                    treeData={emptyTreeData}
                    onNodeClick={() => { }}
                    onClickBack={() => { }}
                    theme="light"
                />
            );

            expect(mockReactFlow).toHaveBeenCalledWith(
                expect.objectContaining({ colorMode: "light" })
            );
        });
    });

    describe("背景色", () => {

        // .react-flow のルート要素自体と、Backgroundコンポーネントが生成する .react-flow__background は
        // それぞれ独立した背景レイヤーであり、colorMode指定時はどちらもライブラリ既定の背景色に上書きされるため、両方を透過にする必要がある
        test("ダークモード時、ReactFlowルート要素の背景色が透過のままである（colorModeライブラリ既定色で上書きされない）", () => {

            render(
                <TodoTreeView
                    treeData={emptyTreeData}
                    onNodeClick={() => { }}
                    onClickBack={() => { }}
                    theme="dark"
                />
            );

            expect(mockReactFlow).toHaveBeenCalledWith(
                expect.objectContaining({ style: expect.objectContaining({ backgroundColor: "transparent" }) })
            );
        });

        test("ダークモード時、Backgroundの背景色が透過のままである（colorModeライブラリ既定色で上書きされない）", () => {

            render(
                <TodoTreeView
                    treeData={emptyTreeData}
                    onNodeClick={() => { }}
                    onClickBack={() => { }}
                    theme="dark"
                />
            );

            expect(mockBackground).toHaveBeenCalledWith(
                expect.objectContaining({ bgColor: "transparent" })
            );
        });
    });
});
