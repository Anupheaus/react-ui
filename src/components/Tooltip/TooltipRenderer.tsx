import { createStyles } from '../../theme';
import type { ComponentProps, ReactElement, ReactNode } from 'react';
import { Children, Fragment, useContext, useMemo } from 'react';
import { Tooltip as MuiTooltip } from '@mui/material';
import { createComponent } from '../Component';
import { blankTooltipContext, TooltipContext } from './TooltipContext';

interface Props {
  children: ReactNode;
}
const useStyles = createStyles(({ tooltip }) => ({
  muiPopper: {
    maxWidth: '60%',
  },
  muiTooltip: {
    cursor: 'default',
    backgroundColor: tooltip.backgroundColor,
    color: tooltip.textColor,
    fontSize: tooltip.fontSize,
    fontWeight: tooltip.fontWeight,
    maxWidth: 'unset',
  },
  arrow: {
    color: tooltip.backgroundColor,
  },
}));

export const TooltipRenderer = createComponent('TooltipRenderer', ({
  children = null,
}: Props) => {
  const { css, join } = useStyles();
  const { content, className, showArrow = false, debug = false, persist = false } = useContext(TooltipContext);
  const isEmpty = content == null || content === '';

  const tooltipClasses = useMemo<ComponentProps<typeof MuiTooltip>['classes']>(() => ({
    popper: join(css.muiPopper, className),
    tooltip: css.muiTooltip,
    arrow: css.arrow,
  }), []);

  if (isEmpty && !persist) return <>{children}</>;

  const child = Children.toArray(children)[0] as ReactElement;

  // See the documentation https://v4.mui.com/api/tooltip/#props the child must be a component that can take a ref
  // eslint-disable-next-line no-console
  if (child.type === Fragment) console.warn('TOOLTIP Fail: Fragment is not supported as a target of a tooltip.');

  return (
    <TooltipContext.Provider value={blankTooltipContext}>
      <MuiTooltip
        classes={tooltipClasses}
        title={content}
        arrow={showArrow}
        enterDelay={300}
        enterNextDelay={300}
        leaveDelay={debug ? 600000 : undefined}
      >
        {child}
      </MuiTooltip>
    </TooltipContext.Provider>
  );
});
