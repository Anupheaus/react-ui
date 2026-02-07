import type { PromiseMaybe } from '@anupheaus/common';
import { createStyles } from '../../theme';
import { Button } from '../Button';
import { createComponent } from '../Component';
import type { IconName } from '../Icon';
import { Icon } from '../Icon';
import { Tag } from '../Tag';
import type { MouseEvent } from 'react';

const useStyles = createStyles({
  floatingActionButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 40,
    height: 40,
    zIndex: 1000,
  },
  button: {
    width: '100%',
    height: '100%',
  },
  icon: {
    paddingTop: 3,
    paddingLeft: 1,
  },
});

interface Props {
  className?: string;
  iconName?: IconName;
  onClick?(event: MouseEvent): PromiseMaybe<void>;
  onMouseOver?(event: MouseEvent): void;
  onMouseLeave?(event: MouseEvent): void;
}

export const FloatingActionButton = createComponent('FloatingActionButton', ({
  className,
  iconName,
  onClick,
  onMouseOver,
  onMouseLeave,
}: Props) => {
  const { css, join } = useStyles();

  return (
    <Tag
      name="floating-action-button"
      className={join(css.floatingActionButton, className)}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      <Button
        variant="default"
        size="large"
        iconOnly
        onClick={onClick}
        className={css.button}
      >
        <Icon name={iconName ?? 'add'} className={css.icon} />
      </Button>
    </Tag>
  );
});