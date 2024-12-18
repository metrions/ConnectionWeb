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

            <Controller setType={setType} type={type} setStateSequence={setStateSequence} setImage={setImageSrc} />



        </div>
    );
};
export default App;
