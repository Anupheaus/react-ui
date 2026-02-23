import { createComponent } from '../Component';
import type { WindowState } from './WindowsModels';
import type { InternalWindowsProps } from './InternalWindows';
import { InternalWindows } from './InternalWindows';

interface Props<StateType extends WindowState = WindowState> extends InternalWindowsProps {
  localStorageKey?: string;
  states?: StateType[];
  onChange?(states: StateType[]): void;
}

export const Windows = createComponent('Windows', <StateType extends WindowState = WindowState>(props: Props<StateType>) => (
  <InternalWindows {...props} managerType="windows" />
));
