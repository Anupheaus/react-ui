import type { ReactNode } from 'react';
import { useState } from 'react';
import { useBound, useId } from '../../hooks';
import { createLegacyStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import type { WindowState } from '../Windows';
import { Windows } from '../Windows';
import { DialogsManagerIdContext } from './DialogsContext';

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

interface Props {
  id?: string;
  shouldBlurBackground?: boolean;
  children: ReactNode;
}

export const Dialogs = createComponent('Dialogs', ({
  id,
  shouldBlurBackground = false,
  children,
}: Props) => {
  const managerId = id ?? useId();
  const { css, join } = useStyles();
  const [areDialogsOpen, setAreDialogsOpen] = useState(false);

  const handleStatesChanged = useBound((states: WindowState[]) => {
    setAreDialogsOpen(states.length > 0);
  });

  return (
    <Tag name="dialogs" className={join(css.dialogs, shouldBlurBackground && areDialogsOpen && 'blur-background')}>
      <DialogsManagerIdContext.Provider value={managerId}>
        <Windows id={managerId} className={join(css.windows, areDialogsOpen && 'disable-interaction')} onChange={handleStatesChanged} />
        {children}
      </DialogsManagerIdContext.Provider>
    </Tag >
  );
});