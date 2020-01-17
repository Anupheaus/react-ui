import { IGeometry } from 'anux-common';
import { HTMLTargetDelegate } from '../useDOMRef';

export interface IUseDragAndResizeResult {
  dragTarget: HTMLTargetDelegate;
  moveTarget: HTMLTargetDelegate;
  resizeTarget: HTMLTargetDelegate;
}

export interface IDragAndResizeConfig {
  geometry?: IGeometry;
  minWidth: number;
  minHeight: number;
  canBeMoved?: boolean;
  canBeResized?: boolean;
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
