import type { PromiseMaybe } from '@anupheaus/common';
import { createDialog } from './createDialog';
import type { ReactNode } from 'react';

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

export const useConfirmationDialog = createDialog('ConfirmationDialog', ({ Dialog, Content, Actions, Action }) => ({
  title: propsTitle,
  message: propsMessage,
  minWidth,
  hideOk = false,
  okLabel = 'Yes',
  hideCancel = false,
  cancelLabel = 'No',
  children,
  onClosing,
}: Props) => (title?: ReactNode, message?: ReactNode) =>
  (
    <Dialog title={title ?? propsTitle ?? 'Confirmation'} minWidth={minWidth} onClosing={onClosing}>
      <Content>
        {message ?? children ?? propsMessage ?? 'Are you sure?'}
      </Content>
      <Actions>
        {!hideCancel && <Action value='no'>{cancelLabel}</Action>}
        {!hideOk && <Action value='yes'>{okLabel}</Action>}
      </Actions>
    </Dialog>
  ));
