import { ComponentProps, useLayoutEffect } from 'react';
import { createComponent } from '../Component';
import { useWindows, Window } from '../Windows';
import { createStyles } from '../../theme';
import { DistributedState, useBound, useDistributedState, useId } from '../../hooks';
import { DialogState } from './InternalDialogModels';

export interface DialogProps extends Omit<ComponentProps<typeof Window>, 'id' | 'hideMaximizeButton' | 'hideCloseButton' | 'disableDrag' | 'disableResize' | 'initialPosition' | 'onClosing' | 'onClosed'> {
  allowMaximizeButton?: boolean;
  allowCloseButton?: boolean;
  allowDrag?: boolean;
  allowResize?: boolean;
  disableBlurBackground?: boolean;
  onClosing?(reason: string): void;
  onClosed?(reason: string): void;
}

interface Props extends DialogProps {
  id?: string;
  state: DistributedState<DialogState>;
}

const useStyles = createStyles({
  dialogContent: {
    flexDirection: 'column',
    gap: 16,
    padding: 16,
  },
});

export const Dialog = createComponent('Dialog', ({
  allowMaximizeButton = false,
  allowCloseButton = false,
  allowDrag = false,
  allowResize = false,
  disableBlurBackground: ignored,
  onClosing,
  onClosed,
  id: providedId,
  state,
  ...props
}: Props) => {
  const { getAndObserve: getDialogState } = useDistributedState(state);
  const { isOpen, closeReason } = getDialogState();
  const internalId = useId();
  const id = providedId ?? internalId;
  const { closeWindow, addWindow } = useWindows();
  const { css, join } = useStyles();

  const handleClosing = useBound(() => onClosing?.(closeReason ?? 'unknown'));
  const handleClosed = useBound(() => onClosed?.(closeReason ?? 'unknown'));

  useLayoutEffect(() => {
    if (isOpen) {
      addWindow(
        <Window
          {...props}
          id={id}
          initialPosition={'center'}
          contentClassName={join(css.dialogContent, props.contentClassName)}
          hideMaximizeButton={!allowMaximizeButton}
          hideCloseButton={!allowCloseButton}
          disableDrag={!allowDrag}
          disableResize={!allowResize}
          onClosing={handleClosing}
          onClosed={handleClosed}
        />
      );
    } else {
      closeWindow(id);
    }
  });

  return null;
});
