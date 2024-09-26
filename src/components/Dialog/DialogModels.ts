import type { ReactUIComponent } from '../Component';
import type { UseWindowApi } from '../Windows';

export type UseDialogApi<Name extends string, Args extends unknown[]> = Omit<UseWindowApi<Name, Args>, `open${Name}`> & {
  [key in `open${Name}`]: (...args: Args) => Promise<string | undefined>;
} & {
  [key in Name]: ReactUIComponent<() => JSX.Element>;
};