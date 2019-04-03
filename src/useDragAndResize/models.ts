import { HTMLTargetDelegate } from '../useDOMRef';
import { IGeometry } from 'anux-common';

export interface IUseDragAndResizeResult {
  dragTarget: HTMLTargetDelegate;
  moveTarget: HTMLTargetDelegate;
  resizeTarget: HTMLTargetDelegate;
}

export interface IDragAndResizeConfig {
  geometry?: IGeometry;
  minWidth: number;
  minHeight: number;
  disableResize?: boolean;
  disableMove?: boolean;
  onChanged?(geometry: IGeometry): void;
}

export interface IAdjustment {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  width?: number;
  height?: number;
}
