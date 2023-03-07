import { createAnimationKeyFrame, createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';

const animatingBorder = createAnimationKeyFrame({
  '0%': {
    '--angle': '0deg',
  },
  '100%': {
    '--angle': '360deg',
  },
});

const useStyles = createStyles({
  global: {
    '@property --gradX': {
      syntax: '"<percentage>"',
      inherits: 'false',
      initialValue: '100%',
    },
    '@property --gradY': {
      syntax: '"<percentage>"',
      inherits: 'false',
      initialValue: '0%',
    },
    '@property --angle': {
      syntax: '"<angle>"',
      inherits: 'true',
      initialValue: '0deg',
    },
  },
  animatingBorder: {
    position: 'absolute',
    inset: 0,
    '--gradX': '100%',
    '--gradY': '0%',
    '--angle': '0deg',
    borderImage: 'conic-gradient(from var(--angle), #98000000, #980000 0.1turn, #980000 0.15turn, #98000000 0.25turn) 1',
    borderImageRepeat: 'stretch',
    animationName: animatingBorder,
    borderRadius: 6,
    borderWidth: 2,
    borderStyle: 'solid',
    pointerEvents: 'none',
    animationDuration: '2.5s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
    animationFillMode: 'forwards',
  },
});

interface Props {
  isEnabled?: boolean;
  className?: string;
}

export const AnimatingBorder = createComponent('AnimatingBorder', ({
  isEnabled = true,
  className,
}: Props) => {
  const { css, join } = useStyles();

  if (!isEnabled) return null;

  return (
    <Tag name="animating-border" className={join(css.animatingBorder, className)} />
  );
});