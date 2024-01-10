import { MouseEvent, ReactNode, useContext } from 'react';
import { createComponent } from '../Component';
import { useUIState } from '../../providers/UIStateProvider';
import { createStyles, createAnimationKeyFrame } from '../../theme';
import { Tag } from '../Tag';
import { SkeletonContexts } from './SkeletonContexts';
import { SkeletonTheme } from './SkeletonTheme';
import { AnimatingBorder } from '../AnimatingBorder';

const animation = createAnimationKeyFrame({
  from: {
    opacity: 0.4,
  },
  to: {
    opacity: 1,
  },
});

const useStyles = createStyles(({ useTheme }) => {
  const { color } = useTheme(SkeletonTheme);
  return {
    styles: {
      skeleton: {
        position: 'relative',
        display: 'flex',
        visibility: 'hidden',
        pointerEvents: 'none',
        backgroundColor: color,
        animationDuration: '1s',
        animationDirection: 'alternate',
        animationFillMode: 'both',
        animationPlayState: 'paused',
        animationIterationCount: 'infinite',
        animationName: animation,
      },
      absolutePositioning: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      content: {
        display: 'flex',
        flex: 'auto',
      },
      isVisible: {
        visibility: 'visible',
        pointerEvents: 'all',
        cursor: 'default',
      },
      isPulsing: {
        animationPlayState: 'running',
      },
      isHidden: {
        visibility: 'hidden',
        pointerEvents: 'none',
      },
      usingAnimatedBorder: {
        backgroundColor: 'transparent',
        visibility: 'visible',
      },
      variant_full: {

      },
      variant_content_full: {

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
    },
  };
});

interface Props {
  className?: string;
  contentClassName?: string;
  type?: 'full' | 'text' | 'circle';
  isVisible?: boolean;
  children?: ReactNode;
  useAnimatedBorder?: boolean;
  onClick?(event: MouseEvent<HTMLDivElement>): void;
}

export const Skeleton = createComponent('Skeleton', ({
  className,
  contentClassName,
  type = 'full',
  isVisible,
  children = null,
  useAnimatedBorder = false,
  onClick,
}: Props) => {
  const { css, join } = useStyles();
  const { isLoading } = useUIState();
  const noSkeletons = useContext(SkeletonContexts.noSkeletons);

  if ((!isLoading && children != null) || isVisible === false) return (<>{children}</>);

  return (
    <Tag
      name="skeleton"
      className={join(
        css.skeleton,
        children == null && css.absolutePositioning,
        isLoading && !noSkeletons && css.isVisible,
        useAnimatedBorder && css.usingAnimatedBorder,
        isLoading && !noSkeletons && !useAnimatedBorder && css.isPulsing,
        css[`variant_${type}`],
        className
      )}
    >
      {children != null && (useAnimatedBorder ? children : (
        <Tag
          name="skeleton-content"
          className={join(css.content, css[`variant_content_${type}`], isLoading && css.isHidden, contentClassName)}
          onClick={onClick}
        >
          {children}
        </Tag>
      ))}
      <AnimatingBorder isEnabled={useAnimatedBorder && !noSkeletons} className={css.animatedBorder} />
    </Tag>
  );
});
