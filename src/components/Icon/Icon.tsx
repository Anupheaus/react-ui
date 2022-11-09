import { Ref } from 'react';
import { createComponent } from '../Component';
import { ErrorIcon } from '../../errors/components/ErrorIcon';
import { IconType } from '../../theme';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import { IconTheme } from './IconTheme';

export { IconType };

interface Props {
  className?: string;
  size?: 'normal' | 'small' | 'large' | number;
  ref?: Ref<HTMLDivElement>;
  children: IconType | undefined;
}

export const Icon = createComponent({
  id: 'Icon',

  styles: ({ useTheme }) => {
    const { definition: { opacity } } = useTheme(IconTheme);
    return {
      styles: {
        icon: {
          display: 'flex',
          opacity,
          minWidth: 16,
          minHeight: 16,
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 0,
          flexShrink: 0,
        },
      },
    };
  },

  render({
    className,
    size = 'normal',
    ref,
    children,
  }: Props, { css, join }) {
    const renderIcon = children as unknown as IconType;

    const sizeAmount = (() => {
      if (typeof (size) === 'number') return size;
      switch (size) {
        case 'small': return 16;
        case 'large': return 24;
        default: return 20;
      }
    })();

    return (
      <Tag name="Icon" ref={ref} className={join(css.icon, className)} data-icon-type={renderIcon.name}>
        <Skeleton variant="circle">{renderIcon({ size: sizeAmount })}</Skeleton>
      </Tag>
    );
  },

  onError: (error, { size }) => <ErrorIcon size={size} error={error} />,
});
