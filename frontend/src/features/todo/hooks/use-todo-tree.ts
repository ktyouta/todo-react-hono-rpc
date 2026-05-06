import { paths } from "@/config/paths";
import { Edge, Node } from "@xyflow/react";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TodoTreeItemType, useGetTodoTree } from "../api/get-todo-tree";
import { useTaskId } from "./use-task-id";

const NODE_WIDTH = 220;
const NODE_HEIGHT = 60;
const HORIZONTAL_GAP = 40;
const VERTICAL_GAP = 80;

type TreeNode = TodoTreeItemType & { children: number[] };

/** フラット配列から子リスト付きマップを構築 */
function buildChildrenMap(items: TodoTreeItemType[]): Map<number, TreeNode> {
    const map = new Map<number, TreeNode>();
    items.forEach((item) => map.set(item.id, { ...item, children: [] }));
    items.forEach((item) => {
        if (item.parentId !== null) {
            map.get(item.parentId)?.children.push(item.id);
        }
    });
    return map;
}

/** サブツリーが占める列幅（葉=1、内部ノード=子の合計） */
function getSubtreeWidth(id: number, map: Map<number, TreeNode>): number {
    const node = map.get(id);
    if (!node || node.children.length === 0) {
        return 1;
    }
    return node.children.reduce(
        (sum, childId) => sum + getSubtreeWidth(childId, map),
        0
    );
}

/** 各ノードの座標を再帰的に計算 */
function computePositions(
    id: number,
    depth: number,
    xOffset: number,
    map: Map<number, TreeNode>,
    result: Map<number, { x: number; y: number }>
): void {
    const subtreeWidth = getSubtreeWidth(id, map);
    const x = (xOffset + subtreeWidth / 2) * (NODE_WIDTH + HORIZONTAL_GAP) - NODE_WIDTH / 2;
    const y = depth * (NODE_HEIGHT + VERTICAL_GAP);
    result.set(id, { x, y });

    const node = map.get(id);
    if (!node) {
        return;
    }

    let childOffset = xOffset;
    for (const childId of node.children) {
        computePositions(childId, depth + 1, childOffset, map, result);
        childOffset += getSubtreeWidth(childId, map);
    }
}

const baseNodeStyle: React.CSSProperties = {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    cursor: "pointer",
    padding: "0 12px",
    background: "#fff",
    border: "1px solid #c0c0c0",
};

const currentNodeStyle: React.CSSProperties = {
    ...baseNodeStyle,
    background: "#ecfeff",
    border: "1px solid #06b6d4",
    color: "#0e7490",
};


export function useTodoTree() {

    // タスクID（遷移元）
    const taskId = useTaskId();
    const currentId = Number(taskId);
    // ツリーデータ取得
    const { data } = useGetTodoTree({ id: taskId });
    const items = data.data;
    // ルーティング用
    const navigate = useNavigate();

    // ツリーデータ
    const treeData = useMemo(() => {
        if (items.length === 0) {
            return { nodes: [], edges: [] };
        }

        const map = buildChildrenMap(items);
        const root = items.find((item) => item.parentId === null);

        if (!root) {
            return { nodes: [], edges: [] };
        }

        const positions = new Map<number, { x: number; y: number }>();
        computePositions(root.id, 0, 0, map, positions);

        const nodes: Node[] = items.map((item) => ({
            id: String(item.id),
            position: positions.get(item.id) ?? { x: 0, y: 0 },
            data: { label: `${item.title} #${item.id}` },
            style: item.id === currentId ? currentNodeStyle : baseNodeStyle,
        }));

        const edges: Edge[] = items
            .filter((item) => item.parentId !== null)
            .map((item) => ({
                id: `${item.parentId}-${item.id}`,
                source: String(item.parentId),
                target: String(item.id),
                type: "smoothstep",
            }));

        return { nodes, edges };
    }, [items, currentId]);

    /**
     * ノードクリック時にタスク詳細へ遷移
     */
    function onNodeClick(node: Node) {
        navigate(paths.todoDetail.getHref(Number(node.id)));
    }

    /**
     * 詳細画面へ戻る
     */
    function onClickBack() {
        navigate(paths.todoDetail.getHref(currentId));
    }

    return {
        treeData,
        onNodeClick,
        onClickBack
    }
}
