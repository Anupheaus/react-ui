import { ReactNode, useMemo, useRef, useState } from 'react';
import { useBound, useOnUnmount } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { Windows, WindowsActionsProvider } from '../Windows';
import { DialogApi } from './DialogModels';
import { DialogsContext, DialogsContextProps } from './DialogsContext';

const useStyles = createStyles({
  dialogsContainer: {
    position: 'relative',
    display: 'flex',
    flex: 'auto',
    width: '100%',
    height: '100%',
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
  children: ReactNode;
}

export const DialogsContainer = createComponent('DialogsContainer', ({
  children,
}: Props) => {
  const { css, join } = useStyles();
  const dialogs = useRef(new Map<string, DialogApi>()).current;
  const dialogContents = useRef(new Map<string, ReactNode>()).current;
  const [fullContent, setFullContent] = useState<ReactNode>(null);
  const shouldBlurBackground = dialogContents.size > 0;
  const isUnmounted = useOnUnmount();

  const onOpened = useBound((dialog: DialogApi) => {
    dialogs.set(dialog.id, dialog);
  });

  const onClosed = useBound((dialog: DialogApi) => {
    dialogs.delete(dialog.id);
  });

  const setContent = useBound((dialogId: string, content: ReactNode) => {
    if (isUnmounted()) return;
    if (content != null) {
      dialogContents.set(dialogId, content);
    } else {
      dialogContents.delete(dialogId);
    }
    setFullContent(<>{dialogContents.toValuesArray()}</>);
  });

  const context = useMemo<DialogsContextProps>(() => ({
    isValid: true,
    setContent,
    onOpened,
    onClosed,
  }), []);

  return (
    <Tag name="dialogs-container" className={join(css.dialogsContainer, shouldBlurBackground && css.blurBackground)}>
      <WindowsActionsProvider>
        <DialogsContext.Provider value={context}>
          {children}
        </DialogsContext.Provider>
        <Windows className={css.windows}>
          {fullContent}
        </Windows>
      </WindowsActionsProvider>
    </Tag >
  );
});