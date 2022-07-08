import { IconType as RIIconType } from 'react-icons/lib';
import * as icons from 'react-icons/all';
import { anuxPureFC } from '../../anuxComponents';
import { theme } from '../../theme';
import { MapOf } from 'anux-common';
import { Flex } from '../Flex/Flex';

const useStyles = theme.createStyles({
  icon: {
    opacity: 0.7,
    minWidth: 16,
    minHeight: 16,
    padding: 1,
  },
});

export type IconNameType = keyof typeof icons;

interface Props {
  name: IconNameType;
  className?: string;
  size?: 'normal' | 'small' | 'large' | number;
}

export const Icon = anuxPureFC<Props>('Icon', ({
  name,
  className,
  size = 'normal',
}) => {
  const { classes, join } = useStyles();

  const IconComponent: RIIconType = (icons as unknown as MapOf<RIIconType>)[name as string];
  const sizeAmount = (() => {
    if (typeof (size) === 'number') return size;
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20;
    }
  })();

  return (
    <Flex tagName="Icon" className={join(classes.icon, className)} alignCentrally fixedSize>
      <IconComponent size={sizeAmount} />
    </Flex>
  );
});