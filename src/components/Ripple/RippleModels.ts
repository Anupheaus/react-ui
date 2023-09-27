export interface RippleState {
  isActive: boolean;
  useCoords: boolean;
  x: number;
  y: number;
}

export interface RippleConfig {
  ignoreMouseCoords: boolean;
  rippleElement: HTMLElement | null;
}
