import { CircularProgress, LinearProgress } from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { createAnimationKeyFrame, createStyles, useTheme } from '../../theme';

const pulse = createAnimationKeyFrame({
  '0%': { opacity: 0.3, transform: 'scale(0.8)' },
  '50%': { opacity: 1, transform: 'scale(1)' },
  '100%': { opacity: 0.3, transform: 'scale(0.8)' },
});

const useStyles = createStyles({
  linearProgress: {
    display: 'flex',
    flex: 'auto',
    minWidth: 20,
  },
  circularProgress: {
  },
  dot: {
    display: 'inline-block',
    borderRadius: '50%',
    flexShrink: 0,
    animation: `${pulse} 1.2s ease-in-out infinite`,
  },
});

interface Props {
  variant?: 'linear' | 'circular' | 'dot';
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
  const { theme } = useTheme();
  const muiTheme = useMuiTheme();

  // Single source of truth for the indicator colour: the theme's busy colour if set, otherwise the MUI
  // primary (what the spinner/bar already used), so existing usages are unchanged and the dot matches them.
  const color = theme?.busy?.color ?? muiTheme.palette.primary.main;

  const numericSize = useMemo(() => {
    switch (size) {
      case 'small': return 12;
      case 'normal': return 24;
      case 'large': return 36;
      default: return size;
    }
  }, [size]);

  // The dot is deliberately smaller than the spinner of the same size so it sits comfortably inline (e.g.
  // beside assistive text) rather than dominating the line.
  const dotSize = useMemo(() => {
    switch (size) {
      case 'small': return 7;
      case 'normal': return 12;
      case 'large': return 18;
      default: return Math.round(size * 0.6);
    }
  }, [size]);

  return (
    <Flex tagName="busy" valign="center" gap={variant === 'dot' ? 8 : 12} className={className}>
      {variant === 'linear' && (
        <LinearProgress className={css.linearProgress} sx={{ color }} />
      )}
      {variant === 'circular' && (<>
        <CircularProgress size={numericSize} sx={{ color }} />
        {children}
      </>)}
      {variant === 'dot' && (<>
        <span className={css.dot} style={{ width: dotSize, height: dotSize, backgroundColor: color }} />
        {children}
      </>)}
    </Flex>
  );
});
