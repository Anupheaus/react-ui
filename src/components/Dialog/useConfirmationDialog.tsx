import { createDialog } from './createDialog';
import type { ReactNode } from 'react';

interface Props {
  okLabel?: ReactNode;
  hideOk?: boolean;
  cancelLabel?: ReactNode;
  hideCancel?: boolean;
}

export const useConfirmationDialog = createDialog('ConfirmationDialog', ({
  Dialog, Content, Actions, Action,
}) => (title: ReactNode, message: ReactNode, {

  hideOk = false,
  okLabel = 'Yes',
  hideCancel = false,
  cancelLabel = 'No',
}: Props = {}) =>
  (
    <Dialog title={title}>
      <Content>
        {message}
      </Content>
      <Actions>
        {!hideOk && <Action value='yes'>{okLabel}</Action>}
        {!hideCancel && <Action value='no'>{cancelLabel}</Action>}
      </Actions>
    </Dialog>
  ));
