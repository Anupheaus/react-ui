import type { ReactNode } from 'react';
import { useState } from 'react';
import { useBound } from '../../hooks';
import { createLegacyStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import type { WindowState } from '../Windows';
import type { InternalWindowsProps } from '../Windows/InternalWindows';
import { InternalWindows } from '../Windows/InternalWindows';
import { WindowsManager } from '../Windows/WindowsManager';
import { ConfirmationDialogProvider } from './ConfirmationDialogProvider';

const useStyles = createLegacyStyles({
  dialogs: {
    position: 'relative',
    display: 'flex',
    flex: 'auto',
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    maxWidth: '100%',

    '&>*:not(windows)': {
      transitionProperty: 'filter',
      transitionDuration: '400ms',
      transitionTimingFunction: 'ease',
    },

    '&.blur-background > *:not(windows)': {
      filter: 'blur(2px) brightness(0.8)',
    },
  },
  windows: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 1000,
    '& window': {
      pointerEvents: 'all',
    },

    '&.disable-interaction': {
      pointerEvents: 'all',
    },
  },
});

interface Props extends InternalWindowsProps {
  shouldBlurBackground?: boolean;
  children?: ReactNode;
}

export const Dialogs = createComponent('Dialogs', ({
  id,
  className,
  shouldBlurBackground = false,
  children = null,
  ...props
}: Props) => {
  const managerId = id ?? WindowsManager.DIALOGS_DEFAULT_ID;
  const { css, join } = useStyles();
  const [areDialogsOpen, setAreDialogsOpen] = useState(false);

  const handleStatesChanged = useBound((states: WindowState[]) => {
    setAreDialogsOpen(states.length > 0);
  });

  return (
    <Tag name="dialogs" className={join(css.dialogs, shouldBlurBackground && areDialogsOpen && 'blur-background')}>
      <InternalWindows {...props} id={managerId} className={join(css.windows, areDialogsOpen && 'disable-interaction', className)} onChange={handleStatesChanged} managerType="dialogs" />
      <ConfirmationDialogProvider>
        {children}
      </ConfirmationDialogProvider>
    </Tag >
  );
});