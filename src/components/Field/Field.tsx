import type { CSSProperties, FocusEvent, ReactNode, Ref } from 'react';
import { useRef } from 'react';
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
  hideOptionalLabel?: boolean;
  requiredMessage?: ReactNode;
  help?: ReactNode;
  assistiveHelp?: ReactNode;
  error?: ReactNode;
  ref?: Ref<HTMLInputElement>;
  wide?: boolean;
}

function validateAdornments(adornments: ReactNode | ReactNode[]): boolean {
  if (adornments == null) return false;
  if (adornments instanceof Array) return adornments.length > 0;
  return true;
}

const useStyles = createStyles(({ pseudoClasses, field: { value: { normal, active } } }, { applyTransition }) => ({
  field: {
    display: 'flex',
    flexGrow: 0,
    flexShrink: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // minWidth: 50, removed as it was preventing fields with long labels from growing
    gap: 4,

    '&.is-set-width': {
      flexGrow: 0,
      flexShrink: 0,
    },

    '&.full-height': {
      flexGrow: 1,
      flexShrink: 1,
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
    ...applyTransition('border-color, background-color, color'),

    '&.full-height': {
      flexGrow: 1,
      flexShrink: 1,
    },

    [pseudoClasses.active]: {
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
  skeleton: {
    borderRadius: normal.borderRadius,
  },
}));

interface Props extends FieldProps {
  tagName: string;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  contentClassName?: string;
  contentStyle?: CSSProperties;
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
  minWidth?: string | number;
  height?: string | number;
  fullHeight?: boolean;
  skeleton?: 'outlineOnly';
  onBlur?(event: FocusEvent<HTMLDivElement>): void;
  onContainerSelect?(): void;
}

export const Field = createComponent('Field', ({
  tagName,
  className,
  containerClassName,
  containerStyle,
  contentClassName,
  contentStyle,
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
  minWidth,
  height,
  fullHeight,
  skeleton,
  onBlur,
  onContainerSelect,
  ...props
}: Props) => {
  const { css, join, useInlineStyle, toPx } = useStyles();
  const { Ripple, rippleTarget } = useRipple();
  const containerRef = useDOMRef([ref, rippleTarget]);
  const { isLoading } = useUIState();
  const [isLeftToolbarVisible, showLeftToolbar, hideLeftToolbar] = useBooleanState(useFloatingStartAdornments !== true);
  const [isRightToolbarVisible, showRightToolbar, hideRightToolbar] = useBooleanState(useFloatingEndAdornments !== true);
  const timeoutRef = useRef<any>();
  const hasUnmounted = useOnUnmount();

  const wrappedShowToolbars = useBound(() => {
    clearTimeout(timeoutRef.current);
    showLeftToolbar();
    showRightToolbar();
  });

  const delayedHideToolbars = useBound((event: FocusEvent<HTMLDivElement>) => {
    onBlur?.(event);
    timeoutRef.current = setTimeout(() => {
      if (hasUnmounted()) return;
      if (useFloatingStartAdornments === true) hideLeftToolbar();
      if (useFloatingEndAdornments === true) hideRightToolbar();
    }, 100);
  });

  const wrapInSkeletons = (content: ReactNode) => {
    if (disableSkeleton) return content;
    if (skeleton === 'outlineOnly') return (<>
      {content}
      <Skeleton type="outline" className={css.skeleton} />
    </>);
    return (<>
      <NoSkeletons>{content}</NoSkeletons>
      <Skeleton type="full" className={css.skeleton} />
    </>);
  };

  const wrapContent = (content: ReactNode) => {
    if (noContainer) return content;
    return (
      <Tag
        name={`${tagName}-container`}
        ref={containerRef}
        className={join(css.fieldContainer, isLoading && css.isLoading, (fullHeight || height != null) && 'full-height', containerClassName)}
        tabIndex={allowFocus ? 0 : -1}
        style={containerStyle}
        onFocusCapture={wrappedShowToolbars}
        onBlurCapture={delayedHideToolbars}
      >
        <Ripple isDisabled={disableRipple} />
        {wrapInSkeletons(<>
          {validateAdornments(startAdornments) && (
            <Toolbar
              className={css.toolbarAtStart}
              isFloating={useFloatingStartAdornments ? 'left' : false}
              isVisible={isLeftToolbarVisible}
              onFocus={wrappedShowToolbars}
              onBlur={delayedHideToolbars}
            >
              {startAdornments}
            </Toolbar>
          )}
          <Tag name={`${tagName}-content-container`} className={join(css.fieldContent, contentClassName)} onClick={onContainerSelect} style={contentStyle}>
            {children}
          </Tag>
          {validateAdornments(endAdornments) && (
            <Toolbar
              className={css.toolbarAtEnd}
              isFloating={useFloatingEndAdornments}
              isVisible={isRightToolbarVisible}
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

  fullHeight = height != null ? false : fullHeight;

  const style = useInlineStyle(() => ({
    minWidth: toPx(minWidth),
    ...props.style,
  }), [minWidth, props.style]);

  return (
    <Tag
      {...props}
      name={tagName}
      className={join(css.field, width != null && 'is-set-width', fullHeight && 'full-height', className)}
      width={width ?? (wide === true ? '100%' : undefined)}
      height={height}
      style={style}
    >
      <Label isOptional={hideOptionalLabel ? false : isOptional} help={help}>{label}</Label>
      {wrapContent(children)}
      <AssistiveLabel error={error}>{assistiveHelp}</AssistiveLabel>
      {containerAdornments}
    </Tag>
  );
});
