import { CSSProperties, FocusEvent, ReactNode, Ref, useRef } from 'react';
import { createComponent } from '../Component';
import { useRipple } from '../Ripple';
import { Tag } from '../Tag';
import { Label } from '../Label';
import { AssistiveLabel } from '../AssistiveLabel';
import { useUIState } from '../../providers/UIStateProvider';
import { NoSkeletons, Skeleton } from '../Skeleton';
import { useBooleanState, useBound, useDOMRef, useOnUnmount } from '../../hooks';
import { createStyles } from '../../theme';
import { Toolbar } from '../Toolbar';

export interface FieldProps {
  className?: string;
  label?: ReactNode;
  width?: string | number;
  isOptional?: boolean;
  requiredMessage?: ReactNode;
  help?: ReactNode;
  assistiveHelp?: ReactNode;
  error?: ReactNode;
  ref?: Ref<HTMLInputElement>;
  wide?: boolean;
}

const useStyles = createStyles(({ activePseudoClasses, field: { value: { normal, active } } }) => ({
  field: {
    display: 'flex',
    flexGrow: 0,
    flexShrink: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    minWidth: 50,
    gap: 4,

    '&.is-set-width': {
      flexGrow: 0,
      flexShrink: 0,
    },
  },
  fieldContainer: {
    ...normal,
    display: 'flex',
    flexGrow: 0,
    flexShrink: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    minHeight: 30,
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    transitionProperty: 'border-color, background-color, color',
    transitionDuration: '0.4s',
    transitionTimingFunction: 'ease',

    [activePseudoClasses]: {
      ...active,
    },
  },
  fieldContent: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  isLoading: {
    visibility: 'hidden',
    borderStyle: 'none',
  },
  toolbarAtEnd: {
    borderRadius: 0,
    borderWidth: 0,
    borderLeftWidth: 1,
    right: '-100%',
    left: 'unset',
  },
  toolbarAtStart: {
    borderRadius: 0,
    borderWidth: 0,
    borderRightWidth: 1,
  },
}));

interface Props extends FieldProps {
  tagName: string;
  containerClassName?: string;
  contentClassName?: string;
  startAdornments?: ReactNode;
  endAdornments?: ReactNode;
  useFloatingEndAdornments?: boolean;
  useFloatingStartAdornments?: boolean;
  containerAdornments?: ReactNode;
  noContainer?: boolean;
  children: ReactNode;
  allowFocus?: boolean;
  disableSkeleton?: boolean;
  disableRipple?: boolean;
  style?: CSSProperties;
  hideOptionalLabel?: boolean;
  onBlur?(event: FocusEvent<HTMLDivElement>): void;
  onContainerSelect?(): void;
}

export const Field = createComponent('Field', ({
  tagName,
  className,
  containerClassName,
  contentClassName,
  label,
  width,
  endAdornments,
  useFloatingEndAdornments,
  startAdornments,
  useFloatingStartAdornments,
  containerAdornments,
  isOptional,
  noContainer = false,
  help,
  assistiveHelp,
  error,
  children,
  wide,
  ref,
  allowFocus,
  disableSkeleton = false,
  disableRipple = false,
  hideOptionalLabel,
  onBlur,
  onContainerSelect,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const { Ripple, rippleTarget } = useRipple();
  const containerRef = useDOMRef([ref, rippleTarget]);
  const { isLoading } = useUIState();
  const [isToolbarVisible, showToolbars, hideToolbars] = useBooleanState(false);
  const timeoutRef = useRef<any>();
  const hasUnmounted = useOnUnmount();

  const wrappedShowToolbars = useBound(() => {
    clearTimeout(timeoutRef.current);
    showToolbars();
  });

  const delayedHideToolbars = useBound((event: FocusEvent<HTMLDivElement>) => {
    onBlur?.(event);
    timeoutRef.current = setTimeout(() => {
      if (hasUnmounted()) return;
      hideToolbars();
    }, 100);
  });

  const wrapInSkeletons = (content: ReactNode) => {
    if (disableSkeleton) return content;
    return (<>
      <NoSkeletons>{content}</NoSkeletons>
      <Skeleton />
    </>);
  };

  const wrapContent = (content: ReactNode) => {
    if (noContainer) return content;
    return (
      <Tag name={`${tagName}-container`} ref={containerRef} className={join(css.fieldContainer, isLoading && css.isLoading, containerClassName)} tabIndex={allowFocus ? 0 : -1}
        onFocus={wrappedShowToolbars} onBlur={delayedHideToolbars}>
        <Ripple isDisabled={disableRipple} />
        {wrapInSkeletons(<>
          {startAdornments instanceof Array && (
            <Toolbar
              className={css.toolbarAtStart}
              isFloating={useFloatingStartAdornments ? 'left' : false}
              isVisible={isToolbarVisible}
              onFocus={wrappedShowToolbars}
              onBlur={delayedHideToolbars}
            >
              {startAdornments}
            </Toolbar>
          )}
          <Tag name={`${tagName}-content-container`} className={join(css.fieldContent, contentClassName)} onClick={onContainerSelect}>
            {children}
          </Tag>
          {endAdornments != null && (
            <Toolbar
              className={css.toolbarAtEnd}
              isFloating={useFloatingEndAdornments}
              isVisible={isToolbarVisible}
              onFocus={wrappedShowToolbars}
              onBlur={delayedHideToolbars}
            >
              {endAdornments}
            </Toolbar>
          )}
        </>)}
      </Tag>
    );
  };

  return (
    <Tag {...props} name={tagName} className={join(css.field, width != null && 'is-set-width', className)} width={width ?? (wide === true ? '100%' : undefined)}>
      <Label isOptional={hideOptionalLabel ? false : isOptional} help={help}>{label}</Label>
      {wrapContent(children)}
      <AssistiveLabel error={error}>{assistiveHelp}</AssistiveLabel>
      {containerAdornments}
    </Tag>
  );
});
