import { pureFC } from '../../anuxComponents';
import { useUIState } from '../../providers';
import { useRipple } from '../Ripple';
import { Tag } from '../Tag';
import { Icon } from '../Icon';
import { NoSkeletons, Skeleton } from '../Skeleton';
import { useBound } from '../../hooks';
import { useEventIsolator } from '../../hooks/useEventIsolator';
import { useDOMRef } from '../../hooks/useDOMRef';
import { IconType } from '../../theme';
import { ButtonTheme } from './ButtonTheme';
import { ErrorPanel } from '../../errors/components';

interface Props {
  className?: string;
  icon?: IconType;
  onClick?(): void;
}

export const Button = pureFC<Props>()('Button', ButtonTheme, ({ backgroundColor, activeBackgroundColor, activeTextColor, borderColor, borderRadius, fontSize, fontWeight, textColor }) => ({
  button: {
    appearance: 'none',
    borderWidth: 1,
    borderRadius: borderRadius,
    borderColor: borderColor,
    backgroundColor: backgroundColor,
    borderStyle: 'solid',
    padding: '4px 8px 6px',
    color: textColor,
    fontSize: fontSize,
    fontWeight: fontWeight,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flex: 'none',
    gap: 4,
    alignItems: 'center',
    transitionProperty: 'background-color, color',
    transitionDuration: '400ms',
    transitionTimingFunction: 'ease',
    boxSizing: 'border-box',
    outline: 'none',
    minHeight: 34,

    '&:hover, &:active, &:focus, &:focus-visible': {
      backgroundColor: activeBackgroundColor,
      color: activeTextColor,
    },
  },
  isLoading: {
    pointerEvents: 'none',
    cursor: 'default',
    visibility: 'hidden',
    borderWidth: 0,
  },
  iconOnly: {
    borderRadius: '50%',
    width: 34,
    height: 34,
    padding: 0,
    justifyContent: 'center',
    gap: 0,
  },
}), ({
  theme: { css, join },
  className,
  children = null,
  icon,
  onClick,
}, ref) => {
  const { isLoading } = useUIState();
  const { UIRipple, rippleTarget } = useRipple();
  const eventsIsolator = useEventIsolator({ clickEvents: 'propagation', focusEvents: 'propagation', onParentElement: true });
  const internalRef = useDOMRef([ref, rippleTarget, eventsIsolator]);
  const isIconOnly = icon != null && children == null;

  const handleClick = useBound(() => onClick?.());

  return (
    <Tag
      ref={internalRef}
      name={'button'}
      className={join(
        css.button,
        isLoading && css.isLoading,
        isIconOnly && css.iconOnly,
        className,
      )}
      onClickCapture={handleClick}
    >
      <UIRipple />
      <NoSkeletons>
        {icon != null && <Icon>{icon}</Icon>}
        {children}
      </NoSkeletons>
      <Skeleton />
    </Tag>
  );
}, {
  onError: error => <ErrorPanel error={error} />,
});
