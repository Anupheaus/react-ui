import { CircularProgress, LinearProgress } from '@mui/material';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { ReactNode, useMemo } from 'react';

interface Props {
  variant?: 'linear' | 'circular';
  size?: 'small' | 'normal' | 'large' | number;
  children?: ReactNode;
}

export const Busy = createComponent('Busy', ({
  variant = 'linear',
  size = 'normal',
  children = null,
}: Props) => {

  const numericSize = useMemo(() => {
    switch (size) {
      case 'small': return 12;
      case 'normal': return 24;
      case 'large': return 36;
      default: return size;
    }
  }, [size]);

  return (
    <Flex tagName="busy" valign="center" gap={12}>
      {variant === 'linear' && <LinearProgress />}
      {variant === 'circular' && (<>
        <CircularProgress size={numericSize} />
        {children}
      </>)}
    </Flex>
  );
});
