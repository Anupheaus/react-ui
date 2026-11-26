import type { WindowState } from './WindowsModels';

export interface WindowDefinitionState {
  windowId: string;
  managerId: string;
  windowTypeName?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirrors WindowState's public default for untyped window args
export interface ActiveWindowState<Args extends unknown[] = any> extends WindowState<Args> {
  index: number;
  isFocused: boolean;
}
