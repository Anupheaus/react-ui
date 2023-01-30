import { ReactNode } from 'react';
import { createComponent } from '../../../components/Component';
import { useBound, useOnResize, useUpdatableState } from '../../../hooks';
import { ErrorBoundary } from '../../ErrorBoundary';
import { AnuxError } from '../../types';
import { ErrorPanelTheme } from './ErrorPanelTheme';
import { createStyles, ThemesProvider } from '../../../theme';
import { is } from '@anupheaus/common';
import { ButtonTheme } from '../../../components/Button/ButtonTheme';
import { DialogTheme } from '../../../components/Dialog/DialogTheme';
import { useDialog } from '../../../components/Dialog/useDialog';
import { Flex } from '../../../components/Flex';
import { Button } from '../../../components/Button';
import { FiXCircle } from 'react-icons/fi';

interface Props {
  error?: AnuxError;
  icon?: ReactNode;
  children?: ReactNode;
}

const useStyles = createStyles(({ useTheme, createThemeVariant }) => {
  const { backgroundColor } = useTheme(ErrorPanelTheme);

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
});

export const ErrorPanel = createComponent('ErrorPanel', ({
  error: providedError,
  icon = <FiXCircle size="small" />,
  children = null,
}: Props) => {
  const { css, variants, join } = useStyles();
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
        {icon}
        Error
      </>
    );
  };

  if (error != null) return (
    <ThemesProvider themes={join(variants.dialogTheme)}>
      <Flex tagName="error-panel" className={css.errorPanel}>
        <ThemesProvider themes={join(variants.buttonTheme)}>
          <Button icon={icon} onClick={openDialog}>Error</Button>
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
});
