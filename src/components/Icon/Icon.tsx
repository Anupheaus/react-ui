import { anuxPureFC } from '../../anuxComponents';
import { IconDefinition, IconType, Theme } from '../../providers/ThemeProvider';
import { Tag } from '../Tag';
import { IconTheme } from './IconTheme';

export { IconType };

interface Props {
  className?: string;
  size?: 'normal' | 'small' | 'large' | number;
  theme?: typeof IconTheme;
  children: IconType | undefined;
}

export const Icon = anuxPureFC<Props>('Icon', ({
  className,
  size = 'normal',
  theme,
  children,
}, ref) => {
  const { classes, join } = useTheme(theme);
  const renderIcon = children as unknown as IconDefinition;

  const sizeAmount = (() => {
    if (typeof (size) === 'number') return size;
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20;
    }
  })();

  return (
    <Tag name="Icon" ref={ref} className={join(classes.icon, className)}>
      {renderIcon({ size: sizeAmount })}
    </Tag>
  );
});

const useTheme = Theme.createThemeUsing(IconTheme, styles => ({
  icon: {
    display: 'flex',
    opacity: styles.opacity,
    minWidth: 16,
    minHeight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
}));
