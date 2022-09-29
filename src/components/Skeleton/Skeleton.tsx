import { useContext } from 'react';
import { pureFC } from '../../anuxComponents';
import { useUIState } from '../../providers';
import { createAnimationKeyFrame } from '../../theme';
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
  variant?: 'full' | 'text' | 'circle';
  isVisible?: boolean;
}

export const Skeleton = pureFC<Props>()('Skeleton', SkeletonTheme, ({ color }) => ({
  skeleton: {
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
    flexGrow: 0,
    flexShrink: 0,
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
  variant_text: {
    borderRadius: 4,
    maxHeight: 'calc(100% - 8px)',
  },
  variant_circle: {
    borderRadius: '50%',
  },
}), ({
  theme: {
    css,
    join,
  },
  className,
  variant = 'full',
  isVisible,
  children = null,
}) => {
  const { isLoading } = useUIState({ isLoading: isVisible });
  const noSkeletons = useContext(SkeletonContexts.noSkeletons);

  if (!isLoading && children != null) return (<>{children}</>);

  return (
    <Tag name="skeleton" className={join(css.skeleton, children == null && css.absolutePositioning, isLoading && !noSkeletons && css.isVisible, css[`variant_${variant}`], className)}>
      {children != null && <Tag name="skeleton-content" className={join(css.content, isLoading && css.isHidden)}>{children}</Tag>}
    </Tag>
  );
});
