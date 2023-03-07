export interface WindowState {
  id: string;
  isMaximized?: boolean;
  x?: string | number;
  y?: string | number;
  width?: string | number;
  height?: string | number;
}

export interface WindowApi {
  id: string;
  closeWindow(): void;
  restoreWindow(): void;
  maximizeWindow(): void;
  focus(): void;
}

export type InitialWindowPosition = 'center';
