import { ReactNode } from 'react';
import { createComponent } from '../../../components/Component';
import { Button, ButtonTheme, DialogTheme, Flex, Icon, useDialog } from '../../../components';
import { useBound, useOnResize, useUpdatableState } from '../../../hooks';
import { ErrorBoundary } from '../../ErrorBoundary';
import { AnuxError } from '../../types';
import { ErrorPanelTheme } from './ErrorPanelTheme';
import { ThemesProvider } from '../../../theme';
import { is } from 'anux-common';

interface Props {
  error?: AnuxError;
  children?: ReactNode;
}

export const ErrorPanel = createComponent({
  id: 'ErrorPanel',

  styles: ({ useTheme, createThemeVariant }) => {
    const { definition: { backgroundColor }, icons } = useTheme(ErrorPanelTheme);

    return {
      styles: {
        errorPanel: {
          border: '#b10000 solid 1px',
          borderRadius: 4,
          backgroundColor,
          color: '#5e0000',
          cursor: 'pointer',
        },
        error: {},
      },
      icons,
      variants: {
        buttonTheme: createThemeVariant(ButtonTheme, {
          backgroundColor,
          activeBackgroundColor: 'rgba(0 0 0 / 10%)',
        }),
        dialogTheme: createThemeVariant(DialogTheme, {
          titleBackgroundColor: backgroundColor,
        }),
      },
    };
  },

  render({
    error: providedError,
    children = null,
  }: Props, { css, icons, variants, join }) {
    const [error, setError] = useUpdatableState<AnuxError | undefined>(() => providedError, [providedError]);
    const { height, target } = useOnResize();
    const { Dialog, DialogContent, DialogActions, OkButton, openDialog } = useDialog();

    const handleError = useBound((capturedError: AnuxError) => {
      capturedError.markAsHandled();
      setError(capturedError);
    });

    const renderError = () => {
      if (!is.number(height) || height < 30) return (
        <>
          <Icon size={'small'}>{icons.error}</Icon>
          Error
        </>
      );
    };

    if (error != null) return (
      <ThemesProvider themes={join(variants.dialogTheme)}>
        <Flex tagName="error-panel" className={css.errorPanel}>
          <ThemesProvider themes={join(variants.buttonTheme)}>
            <Button icon={icons.error} onClick={openDialog}>Error</Button>
          </ThemesProvider>
        </Flex>
        <Flex tagName={'error'} ref={target} className={css.error} gap={4} onClick={openDialog}>
          {renderError()}
        </Flex>
        <Dialog title={`Error: ${error.name}`}>
          <DialogContent>
            {error.message}
          </DialogContent>
          <DialogActions>
            <OkButton />
          </DialogActions>
        </Dialog>
      </ThemesProvider>
    );

    return (
      <ErrorBoundary onError={handleError}>
        {children}
      </ErrorBoundary>
    );
  },
});
