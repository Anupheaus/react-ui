import { createHarness } from 'anux-package';
import { CustomTag } from '../customTag';
import { useDragAndResize } from './useDragAndResize';
import './harness.scss';

export const useDragAndResizeHarness = createHarness({ name: 'useDragAndResize' }, () => {
  const { dragTarget, moveTarget, resizeTarget } = useDragAndResize({
    minHeight: 400,
    minWidth: 400,
  });
  return (
    <CustomTag name="draggable-container">
      <CustomTag name="draggable-shell" ref={moveTarget(resizeTarget)}>
        <CustomTag name="draggable-handle" ref={dragTarget} />
      </CustomTag>
    </CustomTag>
  );
});
