import { anuxPureFC } from '../../anuxComponents';
import { useUIState } from '../../providers';
import { IconType, Theme } from '../../providers/ThemeProvider';
import { useRipple } from '../Ripple';
import { Tag } from '../Tag';
import { Icon } from '../Icon';
import { Skeleton } from '../Skeleton';
import { ButtonTheme } from './ButtonTheme';
import { useBound } from '../../hooks';
import { useEventIsolator } from '../../hooks/useEventIsolator';
import { useDOMRef } from '../../useDOMRef';

interface Props {
  className?: string;
  theme?: typeof ButtonTheme;
  icon?: IconType;
  onClick?(): void;
}

export const Button = anuxPureFC<Props>('Button', ({
  className,
  theme,
  children = null,
  icon,
  onClick,
}, ref) => {
  const { classes, join } = useTheme(theme);
  const { isLoading } = useUIState();
  const { UIRipple, rippleTarget } = useRipple();
  const eventsIsolator = useEventIsolator({ allMouseEvents: 'propagation', focusEvents: 'propagation', onParentElement: true });
  const internalRef = useDOMRef([ref, rippleTarget, eventsIsolator]);
  const isIconOnly = icon != null && children == null;

  const handleClick = useBound(() => onClick?.());

  return (
    <Tag
      ref={internalRef}
      name={'button'}
      className={join(
        classes.button,
        isLoading && classes.isLoading,
        isIconOnly && classes.iconOnly,
        classes.theme,
        className,
      )}
      onClick={handleClick}
    >
      <UIRipple />
      {icon != null && <Icon>{icon}</Icon>}
      {children}
      <Skeleton />
    </Tag>
  );
});

const useTheme = Theme.createThemeUsing(ButtonTheme, styles => ({
  button: {
    appearance: 'none',
    borderWidth: 1,
    borderRadius: styles.borderRadius,
    borderColor: styles.borderColor,
    backgroundColor: styles.backgroundColor,
    borderStyle: 'solid',
    padding: '4px 8px 6px',
    color: styles.textColor,
    fontSize: 'var(--button-font-size, inherit)',
    fontWeight: 'var(--button-font-weight, inherit)' as any,
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
      backgroundColor: styles.activeBackgroundColor,
      color: styles.activeTextColor,
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
  },
}));
