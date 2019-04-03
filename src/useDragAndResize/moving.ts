import { IAdjustment } from './models';
import { IDragAndResizeState } from './useDragAndResize';

export function applyMoveExtentsToAdjustment(adjustment: IAdjustment, { config: { minWidth, minHeight }, geometry: { width, height },
  maxExtents: { width: maxWidth, height: maxHeight } }: IDragAndResizeState): IAdjustment {
  width = Math.between(width, minWidth, maxWidth);
  height = Math.between(height, minHeight, maxHeight);
  maxWidth -= width;
  maxHeight -= height;
  return { x1: Math.between(adjustment.x1, 0, maxWidth), y1: Math.between(adjustment.y1, 0, maxHeight), width, height };
}
