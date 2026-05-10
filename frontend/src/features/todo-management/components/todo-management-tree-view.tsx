import { Background, Controls, Edge, Node, Panel, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { HiArrowLeft } from "react-icons/hi2";

type PropsType = {
    treeData: { nodes: Node[]; edges: Edge[]; }
    onNodeClick: (node: Node) => void;
    onClickBack: () => void;
};

export function TodoManagementTreeView({ treeData, onNodeClick, onClickBack }: PropsType) {

    const { nodes, edges } = treeData;

    return (
        <div className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodeClick={(_, node) => onNodeClick(node)}
                fitView
                fitViewOptions={{
                    maxZoom: 1.2,
                }}
                panOnDrag
                zoomOnScroll
            >
                <Panel position="top-left">
                    <button
                        type="button"
                        onClick={onClickBack}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded px-3 py-1.5 shadow-sm"
                    >
                        <HiArrowLeft />
                        <span>詳細に戻る</span>
                    </button>
                </Panel>
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}
