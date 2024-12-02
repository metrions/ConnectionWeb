const Line = ({ startX, startY, endX, endY, color, width, onClick }) => {
    return (
        <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke={color}
            strokeWidth={width}
            onClick={onClick}
        />
    );
};

export default Line;
