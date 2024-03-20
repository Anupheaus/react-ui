import { CSSProperties, ComponentProps, ReactNode, useMemo } from 'react';
import { createComponent } from '../Component';
import { Badge as MuiBadge } from '@mui/material';
import { createStyles } from '../../theme';
import { Skeleton } from '../Skeleton';
import { useUIState } from '../../providers';
import { Tooltip } from '../Tooltip';
import { Flex } from '../Flex';

const useStyles = createStyles(() => ({
  outerBadge: {

  },
  badge: {

    '&.is-loading': {
      visibility: 'hidden',
    },
  },
  skeleton: {
    position: 'absolute',
    inset: 0,
  },
}));

interface Props {
  className?: string;
  style?: CSSProperties;
  horizonalAlign?: 'left' | 'right';
  verticalAlign?: 'top' | 'bottom';
  content?: ReactNode;
  tooltip?: ReactNode;
  children: ReactNode;
}

export const Badge = createComponent('Badge', ({
  className,
  style,
  content: providedContent,
  horizonalAlign = 'right',
  verticalAlign = 'top',
  tooltip,
  children,
}: Props) => {
  const { css, join } = useStyles();
  const { isLoading } = useUIState();

  const classes = useMemo<ComponentProps<typeof MuiBadge>['classes']>(() => ({
    badge: join(css.badge, isLoading && 'is-loading', className),
  }), [className, isLoading]);

  const slotProps = useMemo<ComponentProps<typeof MuiBadge>['slotProps']>(() => ({
    badge: {
      style,
    },
  }), [style]);

  const content = (
    !isLoading && providedContent == null ? undefined : (
      <Skeleton type="circle" className={css.skeleton}>
        <Tooltip content={tooltip}>
          <Flex tagName="badge-content" disableGrow>
            {providedContent}
          </Flex>
        </Tooltip>
      </Skeleton>
    ));

  const anchor = useMemo<ComponentProps<typeof MuiBadge>['anchorOrigin']>(() => ({
    horizontal: horizonalAlign,
    vertical: verticalAlign,
  }), [horizonalAlign, verticalAlign]);

  return (
    <MuiBadge badgeContent={content} className={css.outerBadge} classes={classes} slotProps={slotProps} anchorOrigin={anchor}>
      {children}
    </MuiBadge>
  );
});
