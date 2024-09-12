import { ReactNode, useMemo, useState } from 'react';
import { useBound, useId } from '../../hooks';
import { createLegacyStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { Windows, WindowState } from '../Windows';
import { DialogRenderer } from './DialogRenderer';
import { DialogManagerContext, DialogManagerContextProps } from './DialogContexts';

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
      filter: 'blur(2px)',
    },
  },
  windows: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
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

  const context = useMemo<DialogManagerContextProps>(() => ({ id: managerId, isValid: true }), [managerId]);

  const handleStatesChanged = useBound((states: WindowState[]) => {
    setAreDialogsOpen(states.length > 0);
  });

  const renderDialog = useBound((state: WindowState) => (<DialogRenderer managerId={managerId} state={state} />));

  return (
    <Tag name="dialogs" className={join(css.dialogs, shouldBlurBackground && areDialogsOpen && 'blur-background')}>
      <DialogManagerContext.Provider value={context}>
        {children}
      </DialogManagerContext.Provider>
      <Windows id={managerId} className={css.windows} onCreate={renderDialog} onChange={handleStatesChanged} />
    </Tag >
  );
});