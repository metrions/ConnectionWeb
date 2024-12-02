import React, {useEffect, useState} from "react";
import Panel from "./components/Panel";
import Point from "./components/Point";
import WarmConnection from "./components/Types/WarmConnection";

const DISTANCE_THRESHOLD = 20; // Максимальное расстояние для соединения

const Map = () => {

    const [stateSequence, setStateSequence] = useState("newLine");

    useEffect(() => {
        document.body.classList.add("no-scroll");
    }, []);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Карта */}
            <div
                style={{
                    width: "70%",
                    backgroundColor: "#222",
                    position: "relative",
                }}
            >
                <WarmConnection
                    StateOfSequence={stateSequence}
                    setStateOfSequence={setStateSequence}
                />
            </div>

            {/* Панель управления */}
            <div
                style={{
                    width: "30%",
                    backgroundColor: "#1a1a1a",
                    color: "#fff",
                    padding: "10px",
                    overflowY: "auto",
                }}
            >
                <h3>Управление</h3>
                <button
                    onClick={() => setStateSequence("newLine")} // Исправлено
                    style={{
                        padding: "10px",
                        backgroundColor: "#00701a",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        marginTop: "10px",
                    }}
                >
                    Начать новую последовательность
                </button>
            </div>
        </div>
    );
};
export default Map;
