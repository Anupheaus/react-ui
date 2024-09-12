import type { Dialog } from './Dialog';
import { DialogAction } from './DialogAction';
import type { DialogActions } from './DialogActions';
import type { DialogContent } from './DialogContent';

export interface DialogUtils {
  Content: typeof DialogContent;
  Actions: typeof DialogActions;
  Dialog: typeof Dialog;
  OkayButton: typeof DialogAction;
}

export type DialogDefinition<_Name extends string, Args extends unknown[], Props extends {}> =
  (utils: DialogUtils) => (...args: Args) => (props: Props) => JSX.Element | null;
