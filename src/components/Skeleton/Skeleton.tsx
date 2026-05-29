import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { useContext, useMemo } from 'react';
import { createComponent } from '../Component';
import { useUIState } from '../../providers/UIStateProvider';
import { createAnimationKeyFrame, createStyles } from '../../theme';
import { Tag } from '../Tag';
import { SkeletonContexts } from './SkeletonContexts';
import { AnimatingBorder } from '../AnimatingBorder';

const animation = createAnimationKeyFrame({
  from: {
    opacity: 0.4,
  },
  to: {
    opacity: 1,
  },
});

const useStyles = createStyles(({ skeleton }) => ({
  skeleton: {
    position: 'relative',
    display: 'flex',
    visibility: 'hidden',
    pointerEvents: 'none',
    backgroundColor: skeleton.color,
    animationDuration: '1s',
    animationDirection: 'alternate',
    animationFillMode: 'both',
    animationPlayState: 'paused',
    animationIterationCount: 'infinite',
    animationName: animation,

    '&.is-visible': {
      visibility: 'visible',
      pointerEvents: 'all',
      cursor: 'default',
    },

    '&.is-absolute-positioned': {
      position: 'absolute',
      inset: 0,
    },

    '&.is-using-animated-border': {
      backgroundColor: 'transparent',
      visibility: 'visible',
    },

    '&.is-pulsing': {
      animationPlayState: 'running',
    },

    '&.full-width': {
      flexGrow: 1,
    },
    '&.disable-grow': {
      alignSelf: 'flex-start',
    },
    '&.disable-grow:not(.full-width)': {
      flex: '0 0 auto',
    },
    '&.disable-grow.full-width': {
      flex: '1 1 auto',
      minWidth: 0,
    },
  },
  content: {
    display: 'flex',
    flex: 'auto',
    '&.disable-grow': {
      flex: '0 0 auto',
    },
    '&.is-hidden': {
      visibility: 'hidden',
      pointerEvents: 'none',
    },
  },
  variant_full: {

  },
  variant_content_full: {

  },

  variant_outline: {
    backgroundColor: 'transparent',
    border: '1px solid',
    borderColor: skeleton.color,
  },
  variant_content_outline: {

  },

  variant_text: {
    borderRadius: 4,
    margin: '4px 0',
  },
  variant_content_text: {
    margin: '-4px 0',
  },

  variant_circle: {
    borderRadius: '50%',
  },
  variant_content_circle: {
  },
  animatedBorder: {
    visibility: 'visible',
  },
}));

interface Props {
  className?: string;
  contentClassName?: string;
  type?: 'full' | 'text' | 'circle' | 'outline';
  useRandomWidth?: boolean;
  isVisible?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
  useAnimatedBorder?: boolean;
  wide?: boolean;
  disableGrow?: boolean;
  onClick?(event: MouseEvent<HTMLDivElement>): void;
}

export const Skeleton = createComponent('Skeleton', ({
  className,
  contentClassName,
  type = 'full',
  useRandomWidth = false,
  isVisible,
  style: providedStyle,
  children = null,
  useAnimatedBorder = false,
  wide = false,
  disableGrow = false,
  onClick,
}: Props) => {
  const { css, join } = useStyles();
  const { isLoading } = useUIState({ isLoading: isVisible });
  const noSkeletons = useContext(SkeletonContexts.noSkeletons);

  if (children === false || children === true) children = null;

  const style = useMemo<CSSProperties | undefined>(() => {
    if (!useRandomWidth) return providedStyle;
    return {
      ...providedStyle,
      width: `${20 + Math.round(Math.random() * 80)}%`,
    };
  }, [providedStyle, useRandomWidth]);

  if (style != null && !useRandomWidth) wide = false;

  if (children == null && (useRandomWidth || wide)) children = <span>&nbsp;</span>;

  if (!isLoading && children != null) return (<>{children}</>);

  return (
    <Tag
      name="skeleton"
      className={join(
        css.skeleton,
        type !== 'text' && children == null && !wide && !useRandomWidth && className == null && 'is-absolute-positioned',
        isLoading && !noSkeletons && 'is-visible',
        useAnimatedBorder && 'is-using-animated-border',
        isLoading && !noSkeletons && !useAnimatedBorder && 'is-pulsing',
        css[`variant_${type}`],
        wide && 'full-width',
        disableGrow && 'disable-grow',
        className
      )}
      style={style}
    >
      {children != null && (useAnimatedBorder ? children : (
        <Tag
          name="skeleton-content"
          className={join(css.content, css[`variant_content_${type}`], disableGrow && 'disable-grow', isLoading && 'is-hidden', contentClassName)}
          onClick={onClick}
        >
          {children}
        </Tag>
      ))}
      <AnimatingBorder isEnabled={useAnimatedBorder && !noSkeletons} className={css.animatedBorder} />
    </Tag>
  );
});
