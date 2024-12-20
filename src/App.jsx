import React, {useEffect, useState} from "react";
import WaterConnection from "./components/Types/WaterConnection";
import Controller from "./components/Controller";
import Map from "./components/Map";
import ElectroConnection from "./components/Types/ElectroConnection";

const App = () => {
    const [scale, setScale] = useState(1); // Масштаб
    const [stateSequence, setStateSequence] = useState("newLine");
    const [imageSrc, setImageSrc] = useState(null);
    const [type, setType] = useState("water");
    const [component, setComponent] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 }); // Смещение

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
                    <Map imageSrc = {imageSrc} scale={scale}>
                        {type === "water" && (
                            <WaterConnection
                                offset={offset}
                                setOffset={setOffset}
                                imageSrc={imageSrc}
                                scale={scale}
                                setScale={setScale}
                                StateOfSequence={stateSequence}
                                setStateOfSequence={setStateSequence}
                            />
                            )
                        }
                        {type === "electro" && (
                            <ElectroConnection
                                offset={offset}
                                setOffset={setOffset}
                                component={component}
                                imageSrc={imageSrc}
                                scale={scale}
                                setScale={setScale}
                                StateOfSequence={stateSequence}
                                setStateOfSequence={setStateSequence}
                            />
                        )
                        }
                    </Map>

            </div>

            <Controller
                offset={offset}
                setComponent={setComponent}
                setType={setType}
                type={type}
                setStateSequence={setStateSequence}
                setImage={setImageSrc}
                image={imageSrc}
            />



        </div>
    );
};
export default App;
