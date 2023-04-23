import { ReactNode, useLayoutEffect, useState } from 'react';
import { useId } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { Windows, WindowsManager, WindowState } from '../Windows';

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
  },
  blurBackground: {
    '&>*:not(windows)': {
      filter: 'blur(2px)',
    },
  },
  windows: {
    position: 'absolute',
    inset: 0,
  },
});

interface Props {
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
}: Props) => {
  const { css, join } = useStyles();
  const internalId = useId();
  const id = providedId ?? internalId;
  const [state, saveState] = useState<WindowState[]>([]);

  useLayoutEffect(() => onDialogCountChanged?.(state.length), [state.length, onDialogCountChanged]);

  return (
    <Tag name="dialogs-container" className={join(css.dialogsManager, shouldBlurBackground && state.length > 0 && css.blurBackground)}>
      <WindowsManager id={id}>
        {children}
        <Windows managerId={id} className={css.windows} onStatesUpdated={saveState} />
      </WindowsManager>
    </Tag >
  );
});