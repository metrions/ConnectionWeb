import React, {useEffect, useState} from "react";
import WarmConnection from "./components/Types/WarmConnection";
import Controller from "./components/Controller";
import Map from "./components/Map";

const App = () => {
    const [scale, setScale] = useState(1); // Масштаб
    const [stateSequence, setStateSequence] = useState("newLine");
    const [imageSrc, setImageSrc] = useState(null);

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
                        <WarmConnection
                            imageSrc={imageSrc}
                            scale={scale}
                            setScale={setScale}
                            StateOfSequence={stateSequence}
                            setStateOfSequence={setStateSequence}
                        />
                    </Map>

            </div>

            <Controller setStateSequence={setStateSequence} setImage={setImageSrc} />



        </div>
    );
};
export default App;
