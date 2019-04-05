import { createHarness } from 'anux-package';
import { CustomTag } from '../customTag';
import { useDragAndResize } from './useDragAndResize';
import './harness.scss';
import { Switch } from '@material-ui/core';
import { useState, ChangeEvent } from 'react';
import { useBound } from '../useBound';

interface IState {
  isMovable: boolean;
  isResizable: boolean;
}

export const useDragAndResizeHarness = createHarness({ name: 'useDragAndResize' }, () => {
  const [state, setState] = useState<IState>({
    isMovable: true,
    isResizable: true,
  });
  const { dragTarget, moveTarget, resizeTarget } = useDragAndResize({
    canBeMoved: state.isMovable,
    canBeResized: state.isResizable,
    minHeight: 400,
    minWidth: 400,
  });

  const setIsMovable = useBound((event: ChangeEvent) => setState(s => ({ ...s, isMovable: event.target['checked'] })));
  const setIsResizable = useBound((event: ChangeEvent) => setState(s => ({ ...s, isResizable: event.target['checked'] })));

  return (
    <CustomTag name="draggable-container">
      <CustomTag name="draggable-shell" ref={moveTarget(resizeTarget)}>
        <CustomTag name="draggable-handle" ref={dragTarget} />
      </CustomTag>
      <CustomTag name="draggable-options">
        <CustomTag name="draggable-option"><span>Can Move:</span><span><Switch checked={state.isMovable} onChange={setIsMovable} /></span></CustomTag>
        <CustomTag name="draggable-option"><span>Can Resize:</span><span><Switch checked={state.isResizable} onChange={setIsResizable} /></span></CustomTag>
      </CustomTag>
    </CustomTag>
  );
});
