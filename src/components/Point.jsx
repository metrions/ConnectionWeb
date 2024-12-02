import React from "react";

const Point = ({ x, y, color, onClick }) => {
    return (
        <circle
            cx={x}
            cy={y}
            r={5}
            fill={color}
            onClick={onClick}
            style={{ cursor: "pointer" }}
        />
    );
};

export default Point;
