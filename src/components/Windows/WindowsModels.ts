import { DeferredPromise } from '@anupheaus/common';

export interface WindowState {
  id: string;
  type: string;
  isMaximized?: boolean;
  x?: string | number;
  y?: string | number;
  width?: string | number;
  height?: string | number;
  isPersistable?: boolean;
}

export type NewWindowState = Omit<WindowState, 'id'> & { id?: string; };

export interface WindowEvents {
  id: string;
  allowClosing?: DeferredPromise;
  closing?: DeferredPromise;
  restoring?: DeferredPromise;
  maximizing?: DeferredPromise;
  focusing?: DeferredPromise;
  opening?: DeferredPromise;
}

export type InitialWindowPosition = 'center';


// export interface WindowCommands {
//   addWindow(state: NewWindowState): void;
//   openWindow(state: WindowState): void;
//   closeWindow(id: string): void;
// }
