import { CircularProgress, LinearProgress } from '@mui/material';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { createStyles } from '../../theme';

const useStyles = createStyles({
  linearProgress: {
    display: 'flex',
    flex: 'auto',
    minWidth: 20,
  },
  circularProgress: {
  },
});

interface Props {
  variant?: 'linear' | 'circular';
  size?: 'small' | 'normal' | 'large' | number;
  children?: ReactNode;
  className?: string;
}

export const Busy = createComponent('Busy', ({
  variant = 'linear',
  size = 'normal',
  children = null,
  className,
}: Props) => {
  const { css } = useStyles();

  const numericSize = useMemo(() => {
    switch (size) {
      case 'small': return 12;
      case 'normal': return 24;
      case 'large': return 36;
      default: return size;
    }
  }, [size]);

  return (
    <Flex tagName="busy" valign="center" gap={12} className={className}>
      {variant === 'linear' && (
        <LinearProgress className={css.linearProgress} />
      )}
      {variant === 'circular' && (<>
        <CircularProgress size={numericSize} />
        {children}
      </>)}
    </Flex>
  );
});
