import { ComponentProps, useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { DistributedState, useBatchUpdates, useBound, useDistributedState, useId } from '../../hooks';
import { createStyles, ThemesProvider } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { WindowsProvider, WindowsRenderer, WindowTheme } from '../Windows';
import { Dialog } from './Dialog';
import { DialogTheme } from './DialogTheme';

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

interface Props extends ComponentProps<typeof Dialog> {
  state: DistributedState<boolean>;
}

export const DialogContainer = createComponent('DialogContainer', ({
  state,
  disableBlurBackground = false,
  ...props
}: Props) => {
  const id = useId();
  const { css, variants, join } = useStyles();
  const { getAndObserve, set } = useDistributedState(state);
  const isDialogOpen = getAndObserve();
  const [shouldRenderDialog, setShouldRenderDialog] = useState(isDialogOpen);
  const batchUpdates = useBatchUpdates();

  const handleClosed = useBound((reason: string) => batchUpdates(() => {
    props.onClosed?.(reason);
    set(false);
    setShouldRenderDialog(false);
  }));

  useLayoutEffect(() => {
    if (!isDialogOpen || disableBlurBackground) return;
    Array.from(document.body.childNodes).forEach(node => {
      if (!(node instanceof HTMLElement)) return;
      let ids = node.getAttribute('data-dialog-controllers')?.split(',') ?? [];
      ids = [...ids, id].distinct();
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
        if (!ids.includes(id)) return;
        ids = ids.remove(id);
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
    <Tag name="dialog-container" className={css.dialogContainer}>
      <ThemesProvider themes={join(variants.windowTheme)}>
        <WindowsProvider>
          <Dialog {...props} onClosed={handleClosed} />
          <WindowsRenderer />
        </WindowsProvider>
      </ThemesProvider>
    </Tag>
  ), document.body);
});