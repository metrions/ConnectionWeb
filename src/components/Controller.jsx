import React from "react";
import {toPng} from "html-to-image";

const Controller = ({setStateSequence, setImage}) => {

    const exportToPng = () => {
        const svgElement = document.getElementById("svg-container");
        if (!svgElement) {
            alert("SVG элемент не найден!");
            return;
        }
        toPng(svgElement)
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = "map.png";
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error("Ошибка при экспорте PNG:", err);
            });
    };

    return (
        <>
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
                    }}
                >
                    Начать новую последовательность
                </button>

                <div>
                    {/*<ConsumerSVG/>*/}
                </div>

            </div>
            <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => setImage(event.target.result);
                            reader.readAsDataURL(file);
                        }
                    }}
                    style={{marginBottom: "10px"}}
                />
            {/* Кнопка экспорта */}
            <button onClick={exportToPng} style={{marginLeft: "10px"}}>
                Экспорт в PNG
            </button>

            <div style={{position: "absolute", top: 10, left: 10, zIndex: 10}}>
            </div>
        </>
    );
}

export default Controller;