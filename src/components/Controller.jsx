import React from "react";
import {toPng} from "html-to-image";
import {ReactComponent as ConsumerSVG} from "./elements/consumer.svg";
import {ReactComponent as ProducerSVG} from "./elements/producer.svg";
import "../App.css";
import "./controllerStyles.css"
import {ReactComponent as LineSVG} from "./elements/line.svg";
import {ReactComponent as LineTwo} from "./elements/linesTwo.svg";

const Controller = ({setStateSequence, setImage, type, setType}) => {
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

    const handleClickConsumer = () => {
        setStateSequence("consumer");
    }

    const handleClickProducer= () => {
        setStateSequence("producer");
    }

    const handleClickDraw = () => {
        setStateSequence("draw");
    }

    const handleClickNewLine = () => {
        setStateSequence("newLine");
    }

    const handleRadioChange = (event) => {
        setType(event.target.value);
    }

    const WaterConnectionComponents = () => {
        return (
            <>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <ConsumerSVG onClick={handleClickConsumer}
                                 style={{width: '40px', height: '25px', marginRight: '10px'}}/>
                    <h4>Потребитель</h4>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                <ProducerSVG onClick={handleClickProducer}
                             style={{width: '40px', height: '25px', marginRight: '10px'}}/>
                <h4>Источник</h4>
                </div>
            </>
            )
    }

    const ElectroConnectionComponents = () => {
        return (
            <>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <ConsumerSVG onClick={handleClickConsumer}
                                 style={{width: '40px', height: '25px', marginRight: '10px'}}/>
                    <h4>Потребитель</h4>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <ProducerSVG onClick={handleClickProducer}
                                 style={{width: '40px', height: '25px', marginRight: '10px'}}/>
                    <h4>Источник</h4>
                </div>
            </>
        )
    }

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

                <h4> Тип сети</h4>
                <div>
                    <div className="form_radio_btn">
                        <input checked={type === "water"} onChange={handleRadioChange} id="radio-1" type="radio" name="radio" value="water"/>
                        <label htmlFor="radio-1">Вода</label>
                    </div>
                    <div className="form_radio_btn">
                        <input checked={type === "electro"} onChange={handleRadioChange} id="radio-2" type="radio" name="radio" value="electro"/>
                        <label htmlFor="radio-2">Электричество</label>
                    </div>
                    <div className="form_radio_btn">
                        <input checked={type === "warm"} onChange={handleRadioChange} id="radio-3" type="radio" name="radio" value="warm"/>
                        <label htmlFor="radio-3">Тепло</label>
                    </div>
                </div>
                <h4>Импорт/Экспорт</h4>
                <input
                    className="input-file-btn"
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
                />
                {/* Кнопка экспорта */}
                <button className="input-file-btn" onClick={exportToPng}>
                    Экспорт в PNG
                </button>

                <h4>Компоненты сети</h4>
                <div style={{display: "flex"}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <LineSVG onClick={handleClickNewLine} style={{
                            width: '40px', height: '25px', marginRight: '10px'
                        }}/>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <LineTwo onClick={handleClickDraw} style={{
                            width: '40px', height: '25px', marginRight: '10px'
                        }}/>
                    </div>
                </div>
                {type === "water" && WaterConnectionComponents()}
                {type === "electro" && ElectroConnectionComponents()}
            </div>

            <div style={{position: "absolute", top: 10, left: 10, zIndex: 10}}/>
        </>
    );
}

export default Controller;
