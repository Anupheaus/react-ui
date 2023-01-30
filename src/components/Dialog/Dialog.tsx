import { ComponentProps, useLayoutEffect, useRef } from 'react';
import { UseActions, useBound, useOnUnmount } from '../../hooks';
import { createComponent } from '../Component';
import { useWindows, Window, WindowApi } from '../Windows';
import { createStyles } from '../../theme';

export interface DialogActions {
  close(reason: string): void;
}

interface Props extends Omit<ComponentProps<typeof Window>, 'hideMaximizeButton' | 'hideCloseButton' | 'disableDrag' | 'disableResize' | 'onClosing' | 'onClosed'> {
  allowMaximizeButton?: boolean;
  allowCloseButton?: boolean;
  allowDrag?: boolean;
  allowResize?: boolean;
  disableBlurBackground?: boolean;
  actions: UseActions<DialogActions>;
  onClosing?(reason: string): void;
  onClosed?(reason: string): void;
}

const useStyles = createStyles({
  dialog: {
    flexDirection: 'column',
    gap: 16,
    padding: 16,
  },
});

export const Dialog = createComponent('Dialog', ({
  className,
  children = null,
  allowMaximizeButton = false,
  allowCloseButton = false,
  allowDrag = false,
  allowResize = false,
  actions,
  onClosing,
  onClosed,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const { addWindow } = useWindows();
  const isUnmounted = useOnUnmount();
  const apiRef = useRef<WindowApi>();
  const closingReasonRef = useRef<string>();

  actions({
    close(reason: string) {
      closingReasonRef.current = reason;
      if (!apiRef.current) return;
      apiRef.current.closeWindow();
    },
  });

  const handleClosing = useBound(() => onClosing?.(closingReasonRef.current ?? 'unknown'));
  const handleClosed = useBound(() => onClosed?.(closingReasonRef.current ?? 'unknown'));

  useLayoutEffect(() => {
    (async () => {
      if (isUnmounted()) return;
      apiRef.current = await addWindow(
        <Window
          {...props}
          hideMaximizeButton={!allowMaximizeButton}
          hideCloseButton={!allowCloseButton}
          disableDrag={!allowDrag}
          disableResize={!allowResize}
          initialPosition="center"
          contentClassName={join(css.dialog, className)}
          onClosing={handleClosing}
          onClosed={handleClosed}
        >
          {children}
        </Window>
      );
    })();
  }, []);

  return null;
});
