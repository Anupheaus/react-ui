import { FocusEvent, ReactNode, useMemo, useRef } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { Button } from '../Button';
import { Popover, PopoverClasses, PopoverOrigin } from '@mui/material';
import { useDelegatedBound } from '../../hooks';

const useStyles = createStyles(({ field: { value: { normal: field } } }) => ({
  toolbar: {
    border: field.border,
    borderColor: field.borderColor,
    borderStyle: 'solid',

    '&.is-floating': {
      border: 'none',
    },

    '& button': {
      borderRadius: '0px!important',
      minHeight: '28px!important',
      padding: '4px 4px!important',
      width: '28px!important',
      height: '28px!important',
    },
  },
  popover: {
    pointerEvents: 'none',

    '& button': {
      borderRadius: '0px!important',
      minHeight: '28px!important',
      padding: '4px 4px!important',
      width: '28px!important',
      height: '28px!important',
    },
  },
  popoverPaper: {
    pointerEvents: 'all',
  },
}));

interface Props {
  className?: string;
  children?: ReactNode;
  isFloating?: boolean | 'left' | 'right';
  isVisible?: boolean;
  onBlur?(event: FocusEvent<HTMLDivElement>): void;
  onFocus?(event: FocusEvent<HTMLDivElement>): void;
}

export const Toolbar = createComponent('Toolbar', ({
  className,
  children,
  isFloating = false,
  isVisible = false,
  onBlur,
  onFocus,
}: Props) => {
  const { css, join } = useStyles();
  const elementRef = useRef<HTMLDivElement>(null);

  const handleOnFocusOrBlur = useDelegatedBound((location: number, delegate: ((event: FocusEvent<HTMLDivElement>) => void) | undefined) => (event: FocusEvent<HTMLDivElement>) => {
    if (location === 0 && isFloating === false) delegate?.(event);
    if (location === 1 && isFloating !== false) delegate?.(event);
  });

  let content = (
    <Button.Overrides variant="default">
      {children}
    </Button.Overrides>
  );

  const classes = useMemo<PopoverClasses>(() => ({
    paper: css.popoverPaper,
    root: '',
  }), []);

  const anchorOrigin = useMemo<PopoverOrigin | undefined>(() => isFloating === 'left' ? { vertical: 'center', horizontal: 'left' }
    : (isFloating === 'right' || isFloating === true) ? { vertical: 'center', horizontal: 'right' } : undefined, [isFloating]);

  const transformOrigin = useMemo<PopoverOrigin | undefined>(() => isFloating === 'left' ? { vertical: 'center', horizontal: 'right' }
    : (isFloating === 'right' || isFloating === true) ? { vertical: 'center', horizontal: 'left' } : undefined, [isFloating]);

  if (isFloating !== false) content = (
    <Popover open={isVisible} anchorEl={elementRef.current} className={css.popover} classes={classes} anchorOrigin={anchorOrigin} transformOrigin={transformOrigin} elevation={4}
      onFocusCapture={handleOnFocusOrBlur(1, onFocus)} onBlurCapture={handleOnFocusOrBlur(1, onBlur)}
      disableAutoFocus disableEnforceFocus disableRestoreFocus hideBackdrop>
      {content}
    </Popover>
  );

  return (
    <Tag
      ref={elementRef}
      name="toolbar"
      className={join(css.toolbar, isFloating !== false && 'is-floating', isVisible && 'is-visible', className)}
      onBlur={handleOnFocusOrBlur(0, onBlur)}
      onFocus={handleOnFocusOrBlur(0, onFocus)}
    >
      {content}
    </Tag>
  );
});
