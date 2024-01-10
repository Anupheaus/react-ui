import { ComponentProps, ReactNode, useLayoutEffect, useState } from 'react';
import { useId } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Windows, WindowsManager, WindowState } from '../Windows';
import { Flex } from '../Flex';

const useStyles = createStyles({
  dialogsManager: {
    position: 'relative',
    display: 'flex',
    flex: 'auto',
    width: '100%',
    height: '100%',
    '&>*:not(windows)': {
      transitionProperty: 'filter',
      transitionDuration: '400ms',
      transitionTimingFunction: 'ease',
    },

    '&.blur-background>*:not(windows)': {
      filter: 'blur(2px)',
    },
  },
  disableInteraction: {
    pointerEvents: 'all',
  },
  windows: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    '& window': {
      pointerEvents: 'all',
    },
  },
});

interface Props extends ComponentProps<typeof Flex> {
  id?: string;
  shouldBlurBackground?: boolean;
  children: ReactNode;
  onDialogCountChanged?(count: number): void;
}

export const DialogsManager = createComponent('DialogsManager', ({
  id: providedId,
  shouldBlurBackground = false,
  children,
  onDialogCountChanged,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const internalId = useId();
  const id = providedId ?? internalId;
  const [state, saveState] = useState<WindowState[]>([]);

  useLayoutEffect(() => onDialogCountChanged?.(state.length), [state.length, onDialogCountChanged]);

  return (
    <Flex {...props} tagName="dialogs-container" className={join(css.dialogsManager, shouldBlurBackground && state.length > 0 && 'blur-background', props.className)}>
      <WindowsManager id={id}>
        {children}
        <Windows managerId={id} className={join(css.windows, state.length > 0 && css.disableInteraction)} onStatesUpdated={saveState} />
      </WindowsManager>
    </Flex >
  );
});