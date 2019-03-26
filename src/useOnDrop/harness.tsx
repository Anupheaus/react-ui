import { createHarness } from 'anux-package';
import '../extensions';
import './harness.scss';
import { CustomTag } from '../customTag';
import { useOnDrag } from '../useOnDrag';
import { useOnDrop } from './useOnDrop';
import { ICoordinates } from 'anux-common';
import { useState, CSSProperties } from 'react';

interface IState {
  state: string;
  coordinates: ICoordinates;
  coordinatesDiff: ICoordinates;
  style: CSSProperties;
  draggableData: IData[];
}

interface IData {
  something: string;
}

export const onDropHarness = createHarness({ name: 'onDrop' }, () => {
  const [state, setState] = useState<IState>({
    state: 'idle',
    coordinates: {
      x: 0,
      y: 0,
    },
    coordinatesDiff: {
      x: 0,
      y: 0,
    },
    style: {
      transform: 'translate(300px, 300px)',
    },
    draggableData: [],
  });

  const calculateNewStyle = (coordinates: ICoordinates, diff: ICoordinates): CSSProperties => ({
    transform: `translate(${coordinates.x + diff.x}px, ${coordinates.y + diff.y}px)`,
  });

  const { dragTarget } = useOnDrag<IData, ICoordinates>({
    data: { something: 'else' },
    onDragStart: ({ target, coordinates }) => { setState(s => ({ ...s, state: 'dragStarted', coordinates })); return target.screenCoordinates(); },
    onDrag: ({ coordinates, coordinatesDiff, passthroughData }) => {
      setState(s => ({ ...s, state: 'dragging', coordinates, coordinatesDiff, style: calculateNewStyle(passthroughData, coordinatesDiff) }));
      return passthroughData;
    },
    onDragEnd: ({ coordinates, coordinatesDiff }) => setState(s => ({ ...s, state: 'dragEnded', coordinates, coordinatesDiff })),
  });

  const { dropTarget } = useOnDrop<IData, void>({
    onEntered: draggableData => setState(s => ({ ...s, draggableData })),
    onExited: () => setState(s => ({ ...s, draggableData: [] })),
  });

  return (
    <>
      <CustomTag name="dragging-details" className="boo">
        <CustomTag name="dragging-details-state">State: {state.state}</CustomTag>
        <CustomTag name="dragging-details-coordinates">Coordinates: {`${state.coordinates.x}, ${state.coordinates.y}`}</CustomTag>
        <CustomTag name="dragging-details-coordinates-diff">Difference: {`${state.coordinatesDiff.x}, ${state.coordinatesDiff.y}`}</CustomTag>
        <CustomTag name="dragging-details-dragged-data">Dragged Data: {JSON.stringify(state.draggableData)}</CustomTag>
      </CustomTag>
      <CustomTag name="drop-box" ref={dropTarget} />
      <CustomTag name="draggable-box" ref={dragTarget} style={state.style} />
    </>
  );
});
