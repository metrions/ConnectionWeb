const ConsumerSVG = ({index, x, y, size, color="#004D00" }) => {
    const radius = size / 2; // Радиус круга
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{
                position: "absolute",
                left: x - radius, // Учитываем смещение по оси X
                top: y - radius, // Учитываем смещение по оси Y
                pointerEvents: "none", // Не блокируем клики
            }}
        >
            <circle
                cx={radius} // Центр круга
                cy={radius} // Центр круга
                r={radius} // Радиус круга
                fill={color}
                fillOpacity="0.78"
            />
        </svg>
    );
};

export default ConsumerSVG;