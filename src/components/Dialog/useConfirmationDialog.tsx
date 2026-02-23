import type { DialogDefinitionUtils } from './createDialog';
import { createDialog } from './createDialog';
import { useDialog } from './useDialog';
import type { ReactNode } from 'react';
import { useBound } from '../../hooks';

export interface ConfirmationDialogResult {
  openConfirmationDialog(message?: ReactNode): Promise<boolean>;
  openConfirmationDialog(title?: ReactNode, message?: ReactNode): Promise<boolean>;
}

const ConfirmationDialog = createDialog('ConfirmationDialog', ({ Dialog, Content, Actions, Action, close }: DialogDefinitionUtils<boolean>) => (
  titleOrMessage?: ReactNode,
  messageArg?: ReactNode,
) => {
  const no = useBound(() => close(false));
  const yes = useBound(() => close(true));
  const title = messageArg === undefined ? undefined : titleOrMessage;
  const message = messageArg === undefined ? titleOrMessage : messageArg;
  const content = message ?? 'Are you sure?';

  return (
    <Dialog title={title ?? 'Confirmation'}>
      <Content>
        {content}
      </Content>
      <Actions>
        <Action onClick={no}>No</Action>
        <Action onClick={yes}>Yes</Action>
      </Actions>
    </Dialog>
  );
});

/** Returns a confirmation dialog instance. Each consumer gets its own. Must be used within Dialogs. */
export const useConfirmationDialog = (): ConfirmationDialogResult => useDialog(ConfirmationDialog) as ConfirmationDialogResult;
