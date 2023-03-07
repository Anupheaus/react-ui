import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DistributedState, useBatchUpdates, useBound, useDistributedState, useId } from '../../hooks';
import { createStyles, ThemesProvider } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { Windows, WindowsActionsProvider, WindowTheme } from '../Windows';
import { Dialog, DialogProps } from './Dialog';
import { DialogTheme } from './DialogTheme';
import { DialogWindowActions } from './DialogWindowActions';
import { DialogState } from './InternalDialogModels';

const useStyles = createStyles(({ useTheme, createThemeVariant }) => {
  const { titleBackgroundColor, titleFontSize, titleFontWeight } = useTheme(DialogTheme);
  return {
    styles: {
      dialogContainer: {
        display: 'flex',
        flex: 'auto',
        position: 'absolute',
        inset: 0,
      },
    },
    variants: {
      windowTheme: createThemeVariant(WindowTheme, {
        titleBar: {
          backgroundColor: titleBackgroundColor,
          fontSize: titleFontSize,
          fontWeight: titleFontWeight,
        },
      }),
    },
  };
});

interface Props {
  dialogProps: DialogProps;
  state: DistributedState<DialogState>;
}

export const DialogContainer = createComponent('DialogContainer', ({
  dialogProps,
  state,
}: Props) => {
  const { disableBlurBackground } = dialogProps;
  const containerId = useId();
  const dialogIdRef = useRef(Math.uniqueId());
  const { css, variants, join } = useStyles();
  const { getAndObserve } = useDistributedState(state);
  const { isOpen: isDialogOpen, closeReason } = getAndObserve();
  const [shouldRenderDialog, setShouldRenderDialog] = useState(isDialogOpen);
  const batchUpdates = useBatchUpdates();

  const handleClosing = useBound(() => {
    dialogProps.onClosing?.(closeReason ?? 'Unknown');
  });

  const handleClosed = useBound(() => batchUpdates(() => {
    dialogIdRef.current = Math.uniqueId(); // give the next dialog a new id
    dialogProps.onClosed?.(closeReason ?? 'Unknown');
    setShouldRenderDialog(false);
  }));

  useLayoutEffect(() => {
    if (!isDialogOpen || disableBlurBackground) return;
    Array.from(document.body.childNodes).forEach(node => {
      if (!(node instanceof HTMLElement) || node.getAttribute('data-dialog-container-id') === containerId) return;
      let ids = node.getAttribute('data-dialog-controllers')?.split(',') ?? [];
      ids = [...ids, containerId].distinct();
      node.setAttribute('data-dialog-controllers', ids.join(','));
      if (ids.length > 1) return;
      node.style.transitionDuration = '400ms';
      node.style.transitionTimingFunction = 'ease';
      node.style.transitionProperty = 'filter';
      setTimeout(() => node.style.filter = 'blur(5px)', 0);
    });
    return () => {
      Array.from(document.body.childNodes).forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        let ids = node.getAttribute('data-dialog-controllers')?.split(',') ?? [];
        if (!ids.includes(containerId)) return;
        ids = ids.remove(containerId);
        if (ids.length > 0) {
          node.setAttribute('data-dialog-controllers', ids.join(','));
        } else {
          node.removeAttribute('data-dialog-controllers');
          node.style.filter = '';
        }
      });
    };
  }, [isDialogOpen, disableBlurBackground]);

  useEffect(() => {
    if (!isDialogOpen) return;
    setShouldRenderDialog(isDialogOpen);
  }, [isDialogOpen]);

  if (!shouldRenderDialog) return null;

  return createPortal((
    <Tag name="dialog-container" className={css.dialogContainer} data-dialog-container-id={containerId}>
      <ThemesProvider themes={join(variants.windowTheme)}>
        <WindowsActionsProvider>
          <DialogWindowActions id={dialogIdRef.current} isDialogOpen={isDialogOpen} />
          <Windows>
            <Dialog {...dialogProps} id={dialogIdRef.current} onClosing={handleClosing} onClosed={handleClosed} />
          </Windows>
        </WindowsActionsProvider>
      </ThemesProvider>
    </Tag>
  ), document.body);
});