import { anuxPureFC } from '../../anuxComponents';
import { useUIState } from '../../providers';
import { Tag } from '../Tag';
import { theme } from '../../theme';

const animation = theme.createKeyFrame({
  from: {
    opacity: 0.4,
  },
  to: {
    opacity: 1,
  },
});

const useStyles = theme.createStyles({
  skeleton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    visibility: 'hidden',
    pointerEvents: 'none',
    backgroundColor: 'var(--skeleton-color, rgb(0 0 0 / 7%))',
    animationDuration: '1s',
    animationDirection: 'alternate',
    animationFillMode: 'both',
    animationPlayState: 'paused',
    animationIterationCount: 'infinite',
    animationName: animation,
  },
  isVisible: {
    visibility: 'visible',
    animationPlayState: 'running',
  },
  variant_full: {

  },
});

interface Props {
  className?: string;
  variant?: 'full';
  isVisible?: boolean;
}

export const Skeleton = anuxPureFC<Props>('Skeleton', ({
  className,
  variant = 'full',
  isVisible,
}) => {
  const { classes, join } = useStyles();
  const { isLoading } = useUIState({ isLoading: isVisible });

  return (
    <Tag name="skeleton" className={join(classes.skeleton, isLoading && classes.isVisible, classes[`variant_${variant}`], className)} />
  );
});
