const ConsumerSVG = ({ x, y, size = 30, color = "#004D00", onClick }) => {
    const radius = size / 2; // Радиус круга, чтобы сделать его круглым и центрированным
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{
                position: "absolute",
                left: x - radius, // Смещаем по оси X, чтобы центрировать
                top: y - radius, // Смещаем по оси Y, чтобы центрировать
            }}
            onClick={onClick}
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
