import {useEffect, useRef} from 'react';
import { Line, Transformer } from 'react-konva';

export const CustomLine = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Line
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
            points: shapeProps.type === "type" 
              ? [0,0, Math.max(5, node.width() * scaleX), Math.max(node.height() * scaleY)]
              : [0,0, Math.max(5, node.width() * scaleX), Math.max(node.height() * scaleY), Math.max(4, (node.width() - 30) * scaleX), Math.max(node.height() * scaleY), Math.max(5, node.width() * scaleX), Math.max(node.height() * scaleY), Math.max(5, (node.width()) * scaleX), Math.max((node.height() - 30) * scaleY), Math.max(5, node.width() * scaleX), Math.max(node.height() * scaleY)]
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};
