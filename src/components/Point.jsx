import React from "react";

const Point = ({ x, y, color, onClick }) => {
    return (
        <div
            style={{
                position: "absolute",
                top: y,
                left: x,
                width: 5,
                height: 5,
                backgroundColor: color,
                borderRadius: "50%",
                cursor: "pointer",
            }}
        />
    );
};

export default Point;
