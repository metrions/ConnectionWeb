import React, {useEffect, useState} from 'react';
import ConsumerSVG from "../elements/ConsumerSVG";
import ProducerSVG from "../elements/ProducerSVG";

const DISTANCE_THRESHOLD = 20;

const WaterConnection = ({ StateOfSequence, scale, setScale, imageSrc, setStateOfSequence }) => {
    const [nodes, setNodes] = useState([]); // Точки
    const [lines, setLines] = useState([]); // Линии
    const [tempLine, setTempLine] = useState(null); // Временная линия
    const [offset, setOffset] = useState({ x: 0, y: 0 }); // Смещение
    const [isDragging, setIsDragging] = useState(false); // Флаг перетаскивания

    const [hoveredLine, setHoveredLine] = useState(null);
    const [components, setComponents] = useState([]);
    const [hoveredComponent, setHoveredComponent] = useState(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Delete") {
                if (hoveredLine !== null) {
                    // Удаление линии
                    setLines((prevLines) =>
                        prevLines.filter((_, index) => index !== hoveredLine)
                    );
                    setHoveredLine(null);
                    setStateOfSequence("newLine");
                }

                if (hoveredComponent !== null) {
                    console.log(hoveredComponent);
                    // Удаление компонента
                    setComponents((prevComponents) =>
                        prevComponents.filter((_, index) => index !== hoveredComponent)
                    );
                    setHoveredComponent(null);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [hoveredLine, hoveredComponent, setStateOfSequence]);



    const calculateDistance = (x1, y1, x2, y2) => {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    };

    const findNearestNode = (x, y) => {
        let nearestNode = null;
        let minDistance = DISTANCE_THRESHOLD;

        nodes.forEach((node) => {
            const distance = calculateDistance(x, y, node.x, node.y);
            if (distance <= minDistance) {
                nearestNode = node;
                minDistance = distance;
            }
        });

        return nearestNode; // Вернёт ближайшую точку или null, если ничего не найдено
    };

    const drawAction = (x, y) => {
        const nearestNode = findNearestNode(x, y);

        if (!tempLine) {
            // Создание начальной точки и линии
            if (nearestNode) {
                setTempLine({ startX: nearestNode.x, startY: nearestNode.y });
            } else {
                const newNode = { id: `${nodes.length + 1}`, x, y, color: "red" };
                setNodes((prev) => [...prev, newNode]);
                setTempLine({ startX: x, startY: y });
            }
            return;
        }

        if (nearestNode) {
            // Соединяем с ближайшей точкой
            if (StateOfSequence !== "newLine"){
                setLines((prev) => [
                    ...prev,
                    {
                        startX: tempLine.startX,
                        startY: tempLine.startY,
                        endX: nearestNode.x,
                        endY: nearestNode.y,
                    },
                ]);
            }
            setTempLine({ startX: nearestNode.x, startY: nearestNode.y });
        } else {
            // Добавляем новую точку и линию
            const newNode = { id: `${nodes.length + 1}`, x, y, color: "red" };
            setNodes((prev) => [...prev, newNode]);
            if (StateOfSequence !== "newLine") {
                setLines((prev) => [
                    ...prev,
                    {startX: tempLine.startX, startY: tempLine.startY, endX: x, endY: y},
                ]);
            }
            setTempLine({ startX: x, startY: y });
        }
        setStateOfSequence("draw");
    };

    const [hasMoved, setHasMoved] = useState(false); // Флаг перемещения

    const handleMapClick = (event) => {
        if (hasMoved) {
            setHasMoved(false); // Сброс флага
            return; // Прерываем выполнение, если мышь двигалась
        }

        const svg = event.currentTarget; // Текущее SVG
        const point = svg.createSVGPoint(); // Создаём SVGPoint
        point.x = event.clientX; // Устанавливаем координаты клика
        point.y = event.clientY;

        // Преобразуем координаты с учётом viewBox
        const transformedPoint = point.matrixTransform(svg.getScreenCTM().inverse());
        const x = transformedPoint.x;
        const y = transformedPoint.y;

        switch (StateOfSequence) {
            case "draw":
            case "newLine":
                drawAction(x, y);
                break;
            case "delete":
                break;
            case "consumer":
                consumerClick(x, y);
                break;
            case "producer":
                producerClick(x, y);
                break;
            default:
                break;
        }
    };

    const consumerClick = (x, y) => {
        const nearestNode = findNearestNode(x, y);
        if (nearestNode != null){
            setComponents((prev) => [
                ...prev,
                {startX: nearestNode.x, startY: nearestNode.y, component: <ConsumerSVG x={nearestNode.x} y={nearestNode.y} size={10}/>},
            ]);
        }
        else {
            setComponents((prev) => [
                ...prev,
                {startX: x, startY: y, component: <ConsumerSVG x={x} y={y} size={10}/>},
            ]);
        }
    }



    const producerClick = (x, y) => {
        const nearestNode = findNearestNode(x, y);
        const size = 30; // Устанавливаем нужный размер для продюсера

        if (nearestNode != null) {
            setComponents((prev) => [
                ...prev,
                {
                    index: components.length + 1,
                    startX: nearestNode.x,
                    startY: nearestNode.y,
                    component: <ProducerSVG x={nearestNode.x} y={nearestNode.y} size={size} />,
                },
            ]);
        } else {
            setComponents((prev) => [
                ...prev,
                {
                    index: components.length + 1,
                    startX: x,
                    startY: y,
                    component: <ProducerSVG x={x} y={y} size={size} />,
                },
            ]);
        }
    };


    const handleDragStart = (event) => {
        setIsDragging(true);
        setHasMoved(false); // Сбрасываем флаг перемещения
    };

    const handleDrag = (event) => {
        if (!isDragging) return;
        const deltaX = event.movementX;
        const deltaY = event.movementY;

        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
            setHasMoved(true); // Устанавливаем флаг, если мышь перемещается
        }

        setOffset((prevOffset) => ({
            x: prevOffset.x + deltaX,
            y: prevOffset.y + deltaY,
        }));
    };

    const handleDragEnd = (event) => {
        setIsDragging(false);
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


    const handleLineMouseEnter = (index) => {
        if (StateOfSequence === "draw" || StateOfSequence === "newLine" || StateOfSequence === "line"){
            setHoveredLine(index); // Установить текущую линию как выделенную
        }
    };

    const handleLineMouseLeave = () => {
        setHoveredLine(null); // Сбросить выделение линии
    };

    const handleComponentLeave = () => {
        setHoveredComponent(null);
    }

    const handleComponentMouseEnter = (index) => {
        setHoveredComponent(index);
    };




    return (
        <>
            <svg
                id="svg-container"
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
                    href={imageSrc}
                    x={`10vw`}
                    transform={`scale(${scale})`}
                />
                {lines.map((line, index) => (
                    <line
                        key={index}
                        x1={line.startX}
                        y1={line.startY}
                        x2={line.endX}
                        y2={line.endY}
                        stroke={hoveredLine === index ? "#13bfa6" : "#1e05bd"} // Меняем цвет при наведении
                        strokeWidth={hoveredLine === index ? "6" : "3"} // Меняем толщину при наведении
                        onMouseEnter={() => handleLineMouseEnter(index)} // Обработчик наведения
                        onMouseLeave={handleLineMouseLeave} // Обработчик ухода курсора
                    />
                ))}
                {components.map((comp, index) => (
                    <g
                        key={index}
                        transform={`translate(${comp.startX - 5}, ${comp.startY - 5})`}
                        onMouseEnter={() => handleComponentMouseEnter(index)}
                        onMouseLeave={handleComponentLeave}
                        style={{ pointerEvents: "all" }}
                    >
                        <circle cx={0} cy={0} r={10} fill="transparent" /> {/* Видимая область для наведения */}
                        {comp.component}
                    </g>
                ))}




            </svg>

        </>
    );
};

export default WaterConnection;
