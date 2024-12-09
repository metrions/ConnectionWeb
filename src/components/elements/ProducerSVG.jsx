const ProducerSVG = ({ x, y, size = 50, color1 = "#0e6bb7", color2 = "#0e6bb7" }) => {
    // Устанавливаем размеры прямоугольников в зависимости от size
    const width = size;
    const height = size;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <rect
                stroke="#000"
                rx="350"
                id="svg_1"
                height={height}
                width={width}
                y={0} // Устанавливаем для прямоугольников 0 по оси Y, чтобы они точно влезли в svg
                x={0} // Устанавливаем для прямоугольников 0 по оси X
                fill={color1}
            />
            <rect
                stroke="#000"
                id="svg_2"
                height={height}
                width={width}
                y={height / 2}  // Смещение второго прямоугольника относительно первого
                x={0} // Устанавливаем для второго прямоугольника 0 по оси X
                fill={color2}
            />
        </svg>
    );
};

export default ProducerSVG;
