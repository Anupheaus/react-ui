import type { ReactNode } from 'react';
import { createComponent } from '../../../components/Component';
import { useBound, useOnResize, useUpdatableState } from '../../../hooks';
import { ErrorBoundary } from '../../ErrorBoundary';
import { createStyles } from '../../../theme';
import type { Error } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { Flex } from '../../../components/Flex';
import { Button } from '../../../components/Button';
import { FiXCircle } from 'react-icons/fi';
import { Icon } from '../../../components/Icon';
import { useErrorDialog } from './ErrorDialog';

interface Props {
  error?: Error;
  icon?: ReactNode;
  children?: ReactNode;
}

const useStyles = createStyles({
  errorPanel: {
    border: '#b10000 solid 1px',
    borderRadius: 4,
    backgroundColor: '#f38989',
    color: '#5e0000',
    cursor: 'pointer',
  },
  error: {},
});

export const ErrorPanel = createComponent('ErrorPanel', ({
  error: providedError,
  icon = <FiXCircle size="small" />,
  children = null,
}: Props) => {
  const { css } = useStyles();
  const [error, setError] = useUpdatableState<Error | undefined>(() => providedError, [providedError]);
  const { height, target } = useOnResize();
  const { openErrorDialog } = useErrorDialog();

  const handleError = useBound((capturedError: Error) => {
    capturedError.markAsHandled();
    setError(capturedError);
  });

  const onOpenErrorDialog = useBound(() => {
    if (error == null) return;
    openErrorDialog(error);
  });

  const renderError = () => {
    if (!is.number(height) || height < 30) return (
      <>
        {icon}
        Error
      </>
    );
  };

  if (error != null) return (<>
    <Flex tagName="error-panel" className={css.errorPanel}>
      <Button onClick={onOpenErrorDialog}><Icon name="error" size="small" />Error</Button>
    </Flex>
    <Flex tagName="error" ref={target} className={css.error} gap={4} onClick={onOpenErrorDialog}>
      {renderError()}
    </Flex>
  </>);

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
});
