import type { ReactUIComponent } from '../Component';
import type { UseWindowApi } from '../Windows';

export type UseDialogApi<Name extends string, DialogProps extends {}, OpenArgs extends unknown[], CloseResponseType = string | undefined> =
  Omit<UseWindowApi<Name, OpenArgs, CloseResponseType, DialogProps>, `open${Name}`> & {
    [key in `open${Name}`]: (...args: OpenArgs) => Promise<CloseResponseType>;
  } & {
    [key in Name]: ReactUIComponent<(props: DialogProps) => JSX.Element>;
  };