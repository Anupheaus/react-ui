import { MouseEvent, ReactNode, useContext } from 'react';
import { createComponent } from '../Component';
import { useUIState } from '../../providers';
import { createStyles, createAnimationKeyFrame } from '../../theme';
import { Tag } from '../Tag';
import { SkeletonContexts } from './SkeletonContexts';
import { SkeletonTheme } from './SkeletonTheme';

const animation = createAnimationKeyFrame({
  from: {
    opacity: 0.4,
  },
  to: {
    opacity: 1,
  },
});

interface Props {
  className?: string;
  contentClassName?: string;
  variant?: 'full' | 'text' | 'circle';
  isVisible?: boolean;
  children?: ReactNode;
  onClick?(event: MouseEvent<HTMLDivElement>): void;
}

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
        animationPlayState: 'running',
      },
      isHidden: {
        visibility: 'hidden',
        pointerEvents: 'none',
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
    },
  };
});

export const Skeleton = createComponent('Skeleton', ({
  className,
  contentClassName,
  variant = 'full',
  isVisible,
  children = null,
  onClick,
}: Props) => {
  const { css, join } = useStyles();
  const { isLoading } = useUIState({ isLoading: isVisible });
  const noSkeletons = useContext(SkeletonContexts.noSkeletons);

  if (!isLoading && children != null) return (<>{children}</>);

  return (
    <Tag name="skeleton" className={join(css.skeleton, children == null && css.absolutePositioning, isLoading && !noSkeletons && css.isVisible, css[`variant_${variant}`], className)}>
      {children != null && (
        <Tag
          name="skeleton-content"
          className={join(css.content, css[`variant_content_${variant}`], isLoading && css.isHidden, contentClassName)}
          onClick={onClick}
        >
          {children}
        </Tag>
      )}
    </Tag>
  );
});
