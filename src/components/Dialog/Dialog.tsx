import { ComponentProps, RefObject, useLayoutEffect } from 'react';
import { createComponent } from '../Component';
import { Window } from '../Windows';
import { createLegacyStyles } from '../../theme';
import { PromiseMaybe } from '@anupheaus/common';
import { DialogsManager } from './DialogsManager';
import { useBound, useOnUnmount } from '../../hooks';

export interface DialogProps extends Omit<ComponentProps<typeof Window>, 'id' | 'hideMaximizeButton' | 'hideCloseButton' | 'disableDrag' | 'disableResize' | 'initialPosition' | 'onClosing' | 'onClosed'> {
  allowMaximizeButton?: boolean;
  allowCloseButton?: boolean;
  allowDrag?: boolean;
  allowResize?: boolean;
  disableBlurBackground?: boolean;
  onClosing?(reason: string): PromiseMaybe<boolean | void>;
  onClosed?(reason: string): void;
}

interface Props extends DialogProps {
  id: string;
  managerId: string;
  closeReasonRef: RefObject<string | undefined>;
}

const useStyles = createLegacyStyles({
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
  id,
  managerId,
  closeReasonRef,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const manager = DialogsManager.get(managerId);

  const handleClosing = useBound(() => onClosing?.(closeReasonRef.current ?? 'close'));
  const handleClosed = useBound(() => onClosed?.(closeReasonRef.current ?? 'close'));

  useOnUnmount(() => manager.remove(id));

  useLayoutEffect(() => {
    manager.save(id, (
      <Window
        {...props}
        initialPosition={'center'}
        contentClassName={join(css.dialogContent, props.contentClassName)}
        hideMaximizeButton={!allowMaximizeButton}
        hideCloseButton={!allowCloseButton}
        disableDrag={!allowDrag}
        disableResize={!allowResize}
        onClosing={handleClosing}
        onClosed={handleClosed}
      />
    ));
  }); // do on every render

  return null;
});
