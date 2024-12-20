import React, {useState} from "react";
import {toJpeg, toPng} from "html-to-image";
import {ReactComponent as ProducerSVG} from "./elements/producer.svg";
import "../App.css";
import "./controllerStyles.css"
import {ReactComponent as LineSVG} from "./elements/line.svg";
import {ReactComponent as LineTwo} from "./elements/linesTwo.svg";
import ConsumerSVG from "./elements/ConsumerSVG";
import ReactDOMServer from 'react-dom/server';
import domtoimage from 'dom-to-image';
import ReactDOM from "react-dom/client";

const Controller = ({setComponent, setStateSequence, setImage, type, setType, image}) => {
    const [offset, setOffset] = useState({ x: 0, y: 0 }); // Смещение


    const exportToJpg = () => {
        const svgElement = document.getElementById("svg-container");
        const map = document.getElementById("map").getBoundingClientRect();
        // Получаем размеры и положение SVG
        const boundingBox = svgElement.getBoundingClientRect();

        // Вычисляем координаты центра
        const x = map.x;
        console.log(map);
        const y = boundingBox.bottom;

        const width = map.right - map.left;
        const height = map.top - map.bottom;
        // Копируем SVG элемент
        const svgClone = svgElement.cloneNode(true);

        // Вычисления в JavaScript
        const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        foreignObject.setAttribute("x", x);
        foreignObject.setAttribute("y", y); // Позиция снизу
        foreignObject.setAttribute("width", width+map.left+200); // Ширина по всему SVG
        foreignObject.setAttribute("height", "300px"); // Высота будет зависеть от содержимого

        // Создаем контейнер для компонента React
        const legendContainer = document.createElement("div");

        // Устанавливаем стиль для контейнера легенды
        legendContainer.style.backgroundColor = "white"; // Белый фон
        legendContainer.style.width = map.width+map.left; // Чтобы контейнер занимал всю доступную ширину
        legendContainer.style.height = "300px"; // Чтобы контейнер занимал всю доступную ширину
        legendContainer.style.position = "relative"; // Фиксируем положение контейнера

        // Используем createRoot для рендеринга компонента в контейнере
        const root = ReactDOM.createRoot(legendContainer);
        root.render(<ElectroConnectionComponents />);

        // Добавляем контейнер с компонентом в foreignObject
        foreignObject.appendChild(legendContainer);

        // Вставляем foreignObject в склонированный SVG
        svgElement.appendChild(foreignObject);

        // Теперь экспортируем склонированный SVG в изображение
        toPng(svgElement)
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = "map.png";
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error("Ошибка toPng:", err);
            });
    };






    const handleClickConsumer = (comp) => {
        setStateSequence("consumer");
        console.log(comp);
        setComponent(comp);
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
                    <ConsumerSVG
                        onClick={() => handleClickConsumer(<ConsumerSVG style={{width: '50px', height: '50px'}} />)}
                        style={{width: '50px', height: '50px'}}
                    />
                    <h4 style={{marginLeft: "40px"}}>Существующие ПС 220кВ</h4>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <ConsumerSVG
                        onClick={() => handleClickConsumer(<ConsumerSVG color="red" style={{width: '50px', height: '50px'}}/>)}
                        style={{width: '50px', height: '50px'}}
                        color="red"
                    />
                    <h4 style={{marginLeft: "40px"}}>Существующие ПС 220кВ</h4>
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
                <button className="input-file-btn" onClick={exportToJpg}>
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

        </>
    );
}

export default Controller;
