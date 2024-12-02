import React from 'react';
import Point from "./Point";

const Panel = () => {
    return(
        <>
            {/* Панель для управления */}
            <div
                style={{
                    width: "30%",
                    float: "right",
                    backgroundColor: "#1a1a1a",
                    color: "#fff",
                    padding: "10px",
                    overflowY: "auto",
                }}
            >
                <h3>Панель управления</h3>
                <p>Дважды кликните на карту, чтобы добавить точку.</p>
                <p>Кликните на первую точку, затем на вторую, чтобы соединить их линией.</p>
            </div>
        </>
    );
}

export default Panel;