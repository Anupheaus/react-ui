export interface WindowState {
  id: string;
  isMaximized: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface WindowApi {
  id: string;
  closeWindow(): void;
  restoreWindow(): void;
  maximizeWindow(): void;
  focus(): void;
}
