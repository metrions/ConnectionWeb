import React, { MouseEvent } from "react";
import ReactFlow, { Background, Controls } from "react-flow-renderer";
import Point from "./Point";


const initialElements = [
    {
        id: "1",
        type: "input", // Входной узел
        data: { label: "Перетащите элементы сюда" },
        position: { x: 250, y: 0 },
    },
];

const Map = () =>{

    const handleClick = (event: MouseEvent<HTMLButtonElement>) =>{
        setArrayPoints()
        console.log(event.clientX, event.clientY);
    }

    return (

        <div onClick={handleClick} style={{ height: "100vh", display: "flex", float: "right", width: "70%", backgroundColor: "#222" }}>
            <ReactFlow
                elements={initialElements}
                style={{ background: "#333", color: "#fff" }}
                nodesDraggable
                nodesConnectable
            >

                <Background variant="dots" gap={16} size={1} color="#555" />
                {/* Управление */}
                <Controls />
            </ReactFlow>

        </div>
    );
}

export default Map;