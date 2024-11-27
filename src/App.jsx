import React from "react";
import ReactFlow, { Background, Controls } from "react-flow-renderer";

const initialElements = [
  {
    id: "1",
    type: "input", // Входной узел
    data: { label: "Перетащите элементы сюда" },
    position: { x: 250, y: 0 },
  },
];

const App = () => {
  return (
      <div style={{ height: "100vh", width: "100vw", backgroundColor: "#222" }}>
        <ReactFlow
            elements={initialElements}
            style={{ background: "#333", color: "#fff" }}
            nodesDraggable
            nodesConnectable
        >
          {/* Сетка */}
          <Background variant="dots" gap={16} size={1} color="#555" />
          {/* Управление */}
          <Controls />
        </ReactFlow>
      </div>
  );
};

export default App;
