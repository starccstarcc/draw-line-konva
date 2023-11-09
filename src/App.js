import React, { useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { CustomLine as Line } from './Components/Line';

const lineType = {
  default: [0,0,100,0],
  arrow: [0,0,100,0,70,30,100,0,70,-30,100,0]
}

const initialLine = {
  x: 10,
  y: 10,
  stroke: 'black',
};

const App = () => {
  const [lines, setLines] = React.useState([]);
  const [selectedId, selectShape] = React.useState(null);
  const lineCountRef = useRef(0);
  const {current:lineCount} = lineCountRef;

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleClick = (type) => {
    const tempLines = [...lines]
    console.log(lineCount)
    tempLines.push({
      ...initialLine,
      id: 'line' + lineCount,
      points: lineType[type],
      type
    })
    lineCountRef.current++
    selectShape(null)
    setLines(tempLines)
  }

  return (
    <div>
      <button onClick={()=>handleClick("default")}>Create a Line</button>
      <button onClick={()=>handleClick("arrow")}>Create an Arrow</button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          {lines.map((line, i) => {
            return (
              <Line
                key={i}
                shapeProps={line}
                isSelected={line.id === selectedId}
                onSelect={() => {
                  selectShape(line.id);
                }}
                onChange={(newAttrs) => {
                  const tempLines = lines.slice();
                  tempLines[i] = newAttrs;
                  setLines(tempLines);
                }}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
