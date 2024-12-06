import React, {useEffect} from "react";

const Map = ({ imageSrc, scale, children }) => {
    useEffect(() => {

    }, [imageSrc]);
    return (
        <>
            <image
                id="map"
                href={imageSrc}
                x="0"
                y="0"
                width={100 * scale + "%"}
                height={100 * scale + "%"}
            />
            {children}
        </>
    );
};

export default Map;
