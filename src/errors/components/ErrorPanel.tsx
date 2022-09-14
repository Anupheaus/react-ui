import { is } from 'anux-common';
import { useState } from 'react';
import { anuxPureFC } from '../../anuxComponents';
import { Flex, Icon } from '../../components';
import { useDialog } from '../../components/Dialog';
import { theme } from '../../theme';
import { useBound } from '../../hooks/useBound';
import { useOnResize } from '../../useOnResize';
import { ErrorBoundary } from '../ErrorBoundary';
import { OnErrorProps } from '../models';
import { AnuxError } from '../types';

const useStyles = theme.createStyles({
  error: {
    border: '#b10000 solid 1px',
    borderRadius: 4,
    backgroundColor: '#f38989',
    boxShadow: 'inset 0 0 4px rgb(0 0 0 / 40%)',
    padding: 4,
    color: '#5e0000',
    cursor: 'pointer',
  },
});

interface Props {

}

export const ErrorPanel = anuxPureFC<Props>('ErrorPanel', ({
  children = null,
}) => {
  const [error, setError] = useState<AnuxError>();
  const { classes } = useStyles();
  const { height, width, target } = useOnResize();
  const { Dialog, DialogContent, DialogActions, OkButton, openDialog } = useDialog();

  const handleError = useBound((capturedError: AnuxError) => {
    capturedError.markAsHandled();
    setError(capturedError);
  });

  const renderError = () => {
    if (!is.number(height) || height < 30) return (
      <>
        <Icon name={'MdError'} size={'small'} />
        Error
      </>
    );
  };

  if (error != null) return (<>
    <Flex tagName={'error'} ref={target} className={classes.error} gap={4} onClick={openDialog}>
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
  </>);

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
});