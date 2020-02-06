import { registerHarness } from 'anux-react-package';
import './harness.scss';
import { Switch } from '@material-ui/core';
import { useState, ChangeEvent, useRef } from 'react';
import { IGeometry } from 'anux-common';
import { useBound } from '../useBound';
import { CustomTag } from '../customTag';
import { useDragAndResize } from './useDragAndResize';

interface IState {
  isMovable: boolean;
  isResizable: boolean;
  geometry: IGeometry;
}

registerHarness({ name: 'useDragAndResize' }, () => {
  const [state, setState] = useState<IState>({
    isMovable: true,
    isResizable: true,
    geometry: { x: 0, y: 0, width: 0, height: 0 },
  });
  const flag = useRef<boolean>(false);
  flag.current = !flag.current;
  const { dragTarget, moveTarget, resizeTarget } = useDragAndResize({
    canBeMoved: state.isMovable,
    canBeResized: state.isResizable,
    minHeight: 400,
    minWidth: 400,
    geometry: {
      x: 0,
      y: 0,
      width: 300,
      height: 300,
    },
    onChanged: geometry => setState(s => ({ ...s, geometry })),
  });

  const setIsMovable = useBound((event: ChangeEvent) => setState(s => ({ ...s, isMovable: event.target['checked'] })));
  const setIsResizable = useBound((event: ChangeEvent) => setState(s => ({ ...s, isResizable: event.target['checked'] })));

  return (
    <CustomTag name="draggable-container" className={flag ? 'test-class' : null}>
      <CustomTag name="draggable-shell" ref={moveTarget(resizeTarget)}>
        <CustomTag name="draggable-handle" ref={dragTarget} />
      </CustomTag>
      <CustomTag name="draggable-options">
        <CustomTag name="draggable-option"><span>Can Move:</span><span><Switch checked={state.isMovable} onChange={setIsMovable} /></span></CustomTag>
        <CustomTag name="draggable-option"><span>Can Resize:</span><span><Switch checked={state.isResizable} onChange={setIsResizable} /></span></CustomTag>
        <CustomTag name="draggable-option">
          <span>Geometry:</span>
          <span>{`x: ${state.geometry.x}, y: ${state.geometry.y}, w: ${state.geometry.width}, h: ${state.geometry.height}`}</span>
        </CustomTag>
      </CustomTag>
    </CustomTag>
  );
});
