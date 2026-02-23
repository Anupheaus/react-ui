import { createWindow } from '../Windows/createWindow';
import { type WindowDefinition, type WindowDefinitionUtils } from '../Windows';
import { Dialog } from './Dialog';
import type { ReactUIDialogOnlyWindow } from '../Windows/WindowsModels';

export interface DialogDefinitionUtils<CloseResponseType = string | undefined> extends Omit<WindowDefinitionUtils<CloseResponseType>, 'Window'> {
  Dialog: typeof Dialog;
}

type DialogDefinition<Args extends unknown[], CloseResponseType = string | undefined> =
  (utils: DialogDefinitionUtils<CloseResponseType>) => (...args: Args) => JSX.Element | null;

/**
 * Creates a dialog-only definition (like createWindow but dialog-only).
 * Returns a definition that can be used with useDialog, never useWindow.
 * All data is passed via open() args: (utils) => (args) => JSX.
 */
export function createDialog<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(name: Name,
  dialogDefinition: DialogDefinition<Args, CloseResponseType>): ReactUIDialogOnlyWindow<Name, Args, CloseResponseType> {
  const windowDefinition: WindowDefinition<Args, CloseResponseType> = utils => {
    const { id, ...rest } = utils;
    return dialogDefinition({ Dialog, id, ...rest });
  };
  return createWindow(name, windowDefinition, { dialogOnly: true }) as ReactUIDialogOnlyWindow<Name, Args, CloseResponseType>;
}
