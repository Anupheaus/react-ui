import type { PromiseMaybe } from '@anupheaus/common';
import type { DialogDefinitionUtils } from './createDialog';
import { createDialog } from './createDialog';
import type { ReactNode } from 'react';
import { useBound } from '../../hooks';

interface Props {
  title?: ReactNode;
  minWidth?: number;
  message?: ReactNode;
  okLabel?: ReactNode;
  hideOk?: boolean;
  cancelLabel?: ReactNode;
  hideCancel?: boolean;
  children?: ReactNode;
  onClosing?(reason?: string): PromiseMaybe<boolean | void>;
}

export const useConfirmationDialogInternal = createDialog('ConfirmationDialog', ({ Dialog, Content, Actions, Action, close }: DialogDefinitionUtils<boolean>) => ({
  title: propsTitle,
  message: propsMessage,
  minWidth,
  hideOk = false,
  okLabel = 'Yes',
  hideCancel = false,
  cancelLabel = 'No',
  children,
  onClosing,
}: Props) => {
  function openConfirmationDialog(message?: ReactNode): JSX.Element;
  function openConfirmationDialog(title?: ReactNode, message?: ReactNode): JSX.Element;
  function openConfirmationDialog(titleOrMessage?: ReactNode, message?: ReactNode) {
    const no = useBound(() => close(false));
    const yes = useBound(() => close(true));
    const title = message === undefined ? undefined : titleOrMessage;
    message = message === undefined ? titleOrMessage : message;

    const content = message ?? children ?? propsMessage ?? 'Are you sure?';

    return (
      <Dialog title={title ?? propsTitle ?? 'Confirmation'} minWidth={minWidth} onClosing={onClosing}>
        <Content>
          {content}
        </Content>
        <Actions>
          {!hideCancel && <Action onClick={no}>{cancelLabel}</Action>}
          {!hideOk && <Action onClick={yes}>{okLabel}</Action>}
        </Actions>
      </Dialog>
    );
  }
  return openConfirmationDialog;
});
