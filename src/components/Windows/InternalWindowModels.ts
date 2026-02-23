import type { WindowState } from './WindowsModels';

export interface WindowDefinitionState {
  windowId: string;
  managerId: string;
  windowTypeName?: string;
}

export interface ActiveWindowState<Args extends unknown[] = any> extends WindowState<Args> {
  index: number;
  isFocused: boolean;
}
