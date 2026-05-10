import { paths } from "@/config/paths";
import { Edge, Node } from "@xyflow/react";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TodoManagementTreeItemType, useGetTodoManagementTree } from "../api/get-todo-management-tree";
import { useTaskManagementId } from "./use-task-management-id";

// ノード1つあたりの横幅
const NODE_WIDTH = 220;
// ノード1つあたりの高さ
const NODE_HEIGHT = 60;
// ノード同士の横方向の間隔
const HORIZONTAL_GAP = 40;
// 階層ごとの縦方向の間隔
const VERTICAL_GAP = 80;

type TreeNode = TodoManagementTreeItemType & { children: number[] };

/** フラット配列から子リスト付きマップを構築 */
function buildChildrenMap(items: TodoManagementTreeItemType[]): Map<number, TreeNode> {
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
function getSubtreeWidth(id: number, map: Map<number, TreeNode>, widthCache: Map<number, number>): number {
    const cache = widthCache.get(id);
    if (cache !== undefined) {
        return cache;
    }

    const node = map.get(id);
    if (!node || node.children.length === 0) {
        return 1;
    }
    const width = node.children.reduce(
        (sum, childId) => sum + getSubtreeWidth(childId, map, widthCache),
        0
    );

    widthCache.set(id, width);
    return width;
}

/** 各ノードの座標を再帰的に計算 */
function computePositions(
    id: number,
    depth: number,
    xOffset: number,
    map: Map<number, TreeNode>,
    result: Map<number, { x: number; y: number }>,
    widthCache: Map<number, number>,
): void {
    const subtreeWidth = getSubtreeWidth(id, map, widthCache);
    const x = (xOffset + subtreeWidth / 2) * (NODE_WIDTH + HORIZONTAL_GAP) - NODE_WIDTH / 2;
    const y = depth * (NODE_HEIGHT + VERTICAL_GAP);
    result.set(id, { x, y });

    const node = map.get(id);
    if (!node) {
        return;
    }

    let childOffset = xOffset;
    for (const childId of node.children) {
        computePositions(childId, depth + 1, childOffset, map, result, widthCache);
        childOffset += getSubtreeWidth(childId, map, widthCache);
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

export function useTodoManagementTree() {

    // タスクID（遷移元）
    const taskId = useTaskManagementId();
    const currentId = Number(taskId);
    // ツリーデータ取得
    const { data } = useGetTodoManagementTree({ id: taskId });
    const items = data.data;
    // ルーティング用
    const navigate = useNavigate();

    // ツリーデータ
    const treeData = useMemo(() => {
        if (items.length === 0) {
            return { nodes: [], edges: [] };
        }

        const root = items.find((item) => item.parentId === null);
        if (!root) {
            return { nodes: [], edges: [] };
        }

        const map = buildChildrenMap(items);
        const positions = new Map<number, { x: number; y: number }>();
        const widthCache = new Map<number, number>();
        computePositions(root.id, 0, 0, map, positions, widthCache);

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
     * ノードクリック時にタスク管理詳細へ遷移
     */
    function onNodeClick(node: Node) {
        navigate(paths.todoManagementDetail.getHref(Number(node.id)));
    }

    /**
     * 詳細画面へ戻る
     */
    function onClickBack() {
        navigate(paths.todoManagementDetail.getHref(currentId));
    }

    return {
        treeData,
        onNodeClick,
        onClickBack,
    };
}
