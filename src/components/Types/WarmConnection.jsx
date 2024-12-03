import React, { useState } from 'react';
import Point from "../Point";

const DISTANCE_THRESHOLD = 20;
const LINE_CLICK_THRESHOLD = 2;

const WarmConnection = ({ StateOfSequence, setStateOfSequence }) => {


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

    const newPointAction = (x, y, nearestNode) => {
        if (nearestNode){
            setLines((prev) => [
                ...prev,
                { startX: tempLine.startX, startY: tempLine.startY, endX: nearestNode.x, endY: nearestNode.y },
            ]);
        }
        else{
            setLines((prev) => [
                ...prev,
                { startX: tempLine.startX, startY: tempLine.startY, endX: x, endY: y },
            ]);
        }
    }


    const drawAction = (x, y) => {
        // Логика добавления точек и линий
        if (nodes.length === 0) {
            const newNode = { id: `${nodes.length + 1}`, x, y, color: "red" };
            setNodes((prev) => [...prev, newNode]);
            setStateOfSequence("draw");
            setTempLine({ startX: x, startY: y });
            return;
        }

        const nearestNode = findNearestNode(x, y);
        if (!tempLine) {
            if (nearestNode) {
                setTempLine({ startX: tempLine.startX, startY: tempLine.startY, endX: nearestNode.x, endY: nearestNode.y });
                setLines((prev) => [
                    ...prev,
                    { startX: tempLine.startX, startY: tempLine.startY, endX: nearestNode.x, endY: nearestNode.y },
                ]);
            } else {
                const newNode = { id: `${nodes.length + 1}`, x, y, color: "red" };
                setNodes((prev) => [...prev, newNode]);
                setTempLine({ startX: tempLine.startX, startY: tempLine.startY, endX: x, endY: y });
                setLines((prev) => [
                    ...prev,
                    { startX: tempLine.startX, startY: tempLine.startY, endX: nearestNode.x, endY: nearestNode.y },
                ]);
            }
        } else {
            if (!nearestNode) {
                const newNode = { id: `${nodes.length + 1}`, x, y, color: "red" };
                setNodes((prev) => [...prev, newNode]);
                setTempLine({startX: x, startY: y});
            }
            else{
                setTempLine({startX: x, startY: y});
            }
            if (StateOfSequence !== "newLine") {
                newPointAction(x, y, nearestNode);
            }
            setStateOfSequence("draw");
        }
    }

    const handleMapClick = (event) => {

        const svg = event.currentTarget; // Текущее SVG
        const point = svg.createSVGPoint(); // Создаём SVGPoint
        point.x = event.clientX; // Устанавливаем координаты клика
        point.y = event.clientY;

        // Преобразуем координаты с учётом viewBox
        const transformedPoint = point.matrixTransform(svg.getScreenCTM().inverse());

        const x = transformedPoint.x;
        const y = transformedPoint.y;
        switch (StateOfSequence){
            case "draw":
                drawAction(x, y);
                break;
            case "newLine":
                drawAction(x, y);
                break;
            case "delete":
                break;
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

    const [hoveredLine, setHoveredLine] = useState(null);

    const handleLineMouseEnter = (index) => {
        setHoveredLine(index); // Установить текущую линию как выделенную
    };

    const handleLineMouseLeave = () => {
        setHoveredLine(null); // Сбросить выделение линии
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
                        stroke={hoveredLine === index ? "#13bfa6" : "white"} // Меняем цвет при наведении
                        strokeWidth={hoveredLine === index ? "6" : "3"} // Меняем толщину при наведении
                        onMouseEnter={() => handleLineMouseEnter(index)} // Обработчик наведения
                        onMouseLeave={handleLineMouseLeave} // Обработчик ухода курсора
                    />
                ))}
            </svg>

        </>
    );
};

export default WarmConnection;
