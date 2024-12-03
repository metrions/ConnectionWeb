import React from "react";

const Point = ({ x, y, color, rad=2, onClick }) => {
    return (
        <circle
            cx={x}
            cy={y}
            r={rad}
            fill={color}
            onClick={onClick}
            style={{ cursor: "pointer" }}
        />
    );
};


export default Point;
