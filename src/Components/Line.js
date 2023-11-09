import React, { useEffect, useRef, useState } from 'react';
import { Line, Rect, Group } from 'react-konva';

export const CustomLine = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const startAnchorRef = useRef();
  const endAnchorRef = useRef();
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    if (isSelected) {
      updateAnchorsPosition();
      setInitialLoad(false)
    }
    // eslint-disable-next-line
  }, [isSelected, shapeProps]);

  const updateAnchorsPosition = () => {
    // Use the points from shapeProps to position the anchors
    const [startX, startY, endX, endY] = shapeProps.points;
    const {x, y} = shapeProps
    // Adjust anchor positions to center them on the line ends
    startAnchorRef.current.position({ x: initialLoad? startX - 5 + x : startX - 5, y: initialLoad ? startY - 5 + y : startY - 5 });
    endAnchorRef.current.position({ x: initialLoad? endX - 5 + x : endX - 5, y: initialLoad ? endY - 5 + y : endY - 5 });
    startAnchorRef.current.getLayer().batchDraw();
    endAnchorRef.current.getLayer().batchDraw();
  };

  const handleAnchorDragMove = (e, anchorRef) => {
    const stage = e.target.getStage();
    const mousePointTo = stage.getPointerPosition();

    // Find the opposite anchor to stay in place
    const fixedAnchor = anchorRef === startAnchorRef.current ? endAnchorRef.current : startAnchorRef.current;
    const fixedPoint = [fixedAnchor.x() + 5, fixedAnchor.y() + 5]; // Adjust for anchor centering

    const newPoints = anchorRef === startAnchorRef.current
      ? [mousePointTo.x + 5, mousePointTo.y + 5, fixedPoint[0], fixedPoint[1]] // Adjust for anchor centering
      : [fixedPoint[0], fixedPoint[1], mousePointTo.x + 5, mousePointTo.y + 5]; // Adjust for anchor centering

    // Update the line points
    onChange({
      ...shapeProps,
      points: newPoints,
    });
  };

  const handleLineDragEnd = (e) => {
    const lineNode = shapeRef.current;
    const newPoints = lineNode.points().map((point, index) => {
      return index % 2 === 0 ? point + e.target.x() : point + e.target.y();
    });

    // Reset the line position to avoid the line being offset incorrectly
    lineNode.position({ x: 0, y: 0 });

    // Update the line's points in the state
    onChange({
      ...shapeProps,
      points: newPoints,
    });

    // Update the anchors' positions to match the new ends of the line
    updateAnchorsPosition();
  };

  return (
    <Group>
      <Line
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={handleLineDragEnd}
      />
      {isSelected && (
        <>
          <Rect
            ref={startAnchorRef}
            width={10}
            height={10}
            fill="blue"
            draggable
            onDragMove={(e) => handleAnchorDragMove(e, startAnchorRef.current)}
          />
          <Rect
            ref={endAnchorRef}
            width={10}
            height={10}
            fill="blue"
            draggable
            onDragMove={(e) => handleAnchorDragMove(e, endAnchorRef.current)}
          />
        </>
      )}
    </Group>
  );
};