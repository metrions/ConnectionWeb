import React, { useState } from 'react';
import Point from "../Point";

const DISTANCE_THRESHOLD = 20;
const LINE_CLICK_THRESHOLD = 2;

const WarmConnection = () => {
    const [nodes, setNodes] = useState([]); // Точки
    const [lines, setLines] = useState([]); // Линии
    const [tempLine, setTempLine] = useState(null); // Временная линия
    const [scale, setScale] = useState(1); // Масштаб
    const [offset, setOffset] = useState({ x: 0, y: 0 }); // Смещение
    const [isDragging, setIsDragging] = useState(false); // Флаг перетаскивания

    const calculateDistance = (x1, y1, x2, y2) => {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    };

    const findNearestNode = (x, y) => {
        let nearestNode = null;
        let minDistance = DISTANCE_THRESHOLD;

        nodes.forEach((node) => {
            const distance = calculateDistance(x, y, node.x, node.y);
            if (distance < minDistance) {
                nearestNode = node;
                minDistance = distance;
            }
        });

        return nearestNode;
    };

    const isPointNearLine = (px, py, line) => {
        const { startX, startY, endX, endY } = line;
        const lineLength = calculateDistance(startX, startY, endX, endY);
        const distanceToLine =
            Math.abs((endY - startY) * px - (endX - startX) * py + endX * startY - endY * startX) /
            lineLength;
        return distanceToLine < LINE_CLICK_THRESHOLD;
    };

    const isNodeConnected = (nodeId) => {
        return lines.some(
            (line) => line.startX === nodeId || line.endX === nodeId
        );
    };

    const handleMapClick = (event) => {
        const svg = event.target.closest('svg');
        const svgRect = svg.getBoundingClientRect();
        const x = (event.clientX - svgRect.left - offset.x) / scale;
        const y = (event.clientY - svgRect.top - offset.y) / scale;

        if (event.target.tagName === "line") {
            const clickedLineIndex = lines.findIndex((line) =>
                isPointNearLine(x, y, line)
            );
            if (clickedLineIndex !== -1) {
                const deletedLine = lines[clickedLineIndex];
                setLines((prev) => prev.filter((_, index) => index !== clickedLineIndex));

                const nodesToDelete = [deletedLine.startX, deletedLine.endX];
                setNodes((prev) => prev.filter((node) => {
                    return !nodesToDelete.includes(node.id) || isNodeConnected(node.id);
                }));
            }
            return;
        }

        if (nodes.length === 0) {
            const newNode = { id: `${nodes.length + 1}`, x, y, color: "red" };
            setNodes((prev) => [...prev, newNode]);
            setTempLine({ startX: x, startY: y });
            return;
        }

        const nearestNode = findNearestNode(x, y);
        if (!tempLine) {
            if (nearestNode) {
                setTempLine({ startX: x, startY: y });
            } else {
                const newNode = { id: `${nodes.length + 1}`, x, y, color: "red" };
                setNodes((prev) => [...prev, newNode]);
                setTempLine({ startX: nearestNode.x, startY: nearestNode.y, endX: x, endY: y });
            }
        } else {
            if (nearestNode) {
                setLines((prev) => [
                    ...prev,
                    { startX: tempLine.startX, startY: tempLine.startY, endX: nearestNode.x, endY: nearestNode.y },
                ]);
                setTempLine({ startX: nearestNode.x, startY: nearestNode.y });
            } else {
                const newNode = { id: `${nodes.length + 1}`, x, y, color: "red" };
                setNodes((prev) => [...prev, newNode]);
                setLines((prev) => [
                    ...prev,
                    { startX: tempLine.startX, startY: tempLine.startY, endX: x, endY: y },
                ]);
                setTempLine({ startX: x, startY: y });
            }
        }
    };

    const handleDragStart = (event) => {
        setIsDragging(true);
    };

    const handleDragEnd = (event) => {
        setIsDragging(false);
    };

    const handleDrag = (event) => {
        if (!isDragging) return;
        const deltaX = event.movementX;
        const deltaY = event.movementY;

        setOffset((prevOffset) => ({
            x: prevOffset.x + deltaX,
            y: prevOffset.y + deltaY,
        }));
    };

    const imgContainer = document.getElementById('map');

    const handleZoom = (event) => {
        const zoomFactor = 1.1;

        setScale((prevScale) => {
            const newScale = event.deltaY < 0
                ? Math.min(prevScale * zoomFactor, 5)
                : Math.max(prevScale / zoomFactor, 0.5);

            if (imgContainer) {
                const width = parseFloat(imgContainer.style.width || imgContainer.offsetWidth);
                const height = parseFloat(imgContainer.style.height || imgContainer.offsetHeight);

                imgContainer.style.width = `${width * (newScale / prevScale)}px`;
                imgContainer.style.height = `${height * (newScale / prevScale)}px`;
            }

            return newScale;
        });
    };



    return (
        <>
            <svg
                onClick={handleMapClick}
                onMouseDown={handleDragStart}
                onMouseMove={handleDrag}
                onMouseUp={handleDragEnd}
                onWheel={handleZoom}
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    background: "#222",
                    cursor: isDragging ? "grabbing" : "grab",
                }}
                viewBox={`${-offset.x} ${-offset.y} ${window.innerWidth / scale} ${window.innerHeight / scale}`}
            >
                {/* Картинка */}
                <image
                    id="map"
                    href="https://i.okcdn.ru/i?r=BDGmhjfL9BzD6NIU04xipmtvPuFCGBOTdULV9Cx23iVVxgXK-76PFfRhckg2L96zVvo"
                    x="0"
                    y="0"
                    width={100 * scale + "%"}
                    height={100 * scale +"%"}
                />
                {/* Точки */}
                {nodes.map((node) => (
                    <Point key={node.id} x={node.x} y={node.y} color={node.color}/>
                ))}
                {/* Линии */}
                {lines.map((line, index) => (
                    <line
                        key={index}
                        x1={line.startX}
                        y1={line.startY}
                        x2={line.endX}
                        y2={line.endY}
                        stroke="white"
                        strokeWidth="2"
                    />
                ))}
            </svg>

        </>
    );
};

export default WarmConnection;
