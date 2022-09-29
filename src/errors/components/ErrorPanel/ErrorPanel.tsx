import { is } from 'anux-common';
import { useState } from 'react';
import { pureFC } from '../../../anuxComponents';
import { Button, Flex, Icon, useDialog } from '../../../components';
import { useBound, useOnResize, useUpdatableState } from '../../../hooks';
import { ErrorBoundary } from '../../ErrorBoundary';
import { AnuxError } from '../../types';
import { ErrorPanelTheme } from './ErrorPanelTheme';

interface Props {
  error?: AnuxError;
}

export const ErrorPanel = pureFC<Props>()('ErrorPanel', ErrorPanelTheme, ({ backgroundColor }) => ({
  errorPanel: {
    border: '#b10000 solid 1px',
    borderRadius: 4,
    backgroundColor,
    padding: 4,
    color: '#5e0000',
    cursor: 'pointer',
  },
}), ({
  theme: {
    css,
    icons,
    ThemedComponent,
  },
  error: providedError,
  children = null,
}) => {
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

  if (error != null) return (<>
    <Flex tagName="error-panel" className={css.errorPanel}>
      <ThemedComponent
        component={Button}
        themeDefinition={({ backgroundColor }) => ({ backgroundColor, activeBackgroundColor: 'rgba(0 0 0 / 10%)' })}
        icon={icons.error}
        onClick={openDialog}
      >
        Error
      </ThemedComponent>
    </Flex>
    {/* <Flex tagName={'error'} ref={target} className={classes.error} gap={4} onClick={openDialog}>
      {renderError()}
    </Flex> */}
    <Dialog title={`Error: ${error.name}`}>
      <DialogContent>
        {error.message}
      </DialogContent>
      <DialogActions>
        <OkButton />
      </DialogActions>
    </Dialog>
  </>);

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
});
