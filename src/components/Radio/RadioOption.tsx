import { is } from '@anupheaus/common';
import { KeyboardEvent } from 'react';
import { DistributedState, useBound, useDistributedState } from '../../hooks';
import { ReactListItem } from '../../models';
import { useUIState } from '../../providers';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { useRipple } from '../Ripple';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import { Typography } from '../Typography';
import { RadioTheme } from './RadioTheme';

const useStyles = createStyles(({ useTheme }) => {
  const { default: { borderColor } } = useTheme(RadioTheme);
  return {
    styles: {
      radio: {
        cursor: 'pointer',
      },
      isLoading: {
        cursor: 'default',
      },
      radioGraphicContainer: {
        position: 'relative',
        display: 'flex',
        flex: 'none',
        width: 20,
        height: 20,
      },
      radioGraphic: {
        position: 'relative',
        display: 'flex',
        flex: 'none',
        width: 16,
        height: 16,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor,
        borderRadius: '50%',
      },
      toggledRadioGraphic: {
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 3,
          backgroundColor: borderColor,
          borderRadius: '50%',
          overflow: 'hidden',
        },
      },
      ripple: {
        inset: -4,
        borderRadius: '50%',
      },
    },
  };
});

interface Props {
  item: ReactListItem;
  state: DistributedState<string>;
}

export const RadioOption = createComponent('RadioOption', ({
  item,
  state,
}: Props) => {
  const { isLoading, isReadOnly } = useUIState();
  const { css, join } = useStyles();
  const { rippleTarget, Ripple } = useRipple();
  const { set, getAndObserve } = useDistributedState(state);

  const isSelected = getAndObserve() === item.id;

  const handleClick = useBound(() => {
    if (isReadOnly || isLoading) return;
    set(item.id);
    item.onSelect?.();
  });

  const handleKeyUp = useBound((event: KeyboardEvent<HTMLDivElement>) => {
    if (isReadOnly || isLoading) return;
    if (![' ', 'Enter'].includes(event.key)) return;
    set(item.id);
    item.onSelect?.();
  });

  return (
    <Flex ref={rippleTarget} tagName="radio" valign="center" align="left" disableGrow className={join(css.radio, isLoading && css.isLoading)} gap={4} allowFocus
      onClickCapture={handleClick} onKeyUp={handleKeyUp}>
      <Tag name="radio-graphic-container" className={css.radioGraphicContainer}>
        <Ripple stayWithinContainer ignoreMouseCoords className={css.ripple} />
        <Skeleton type="circle">
          <Tag name="radio-graphic" className={join(css.radioGraphic, isSelected && css.toggledRadioGraphic)} />
        </Skeleton>
      </Tag>
      {is.not.empty(item.iconName) && <Icon name={item.iconName} size={'small'} />}
      <Typography type="field-value">{item.label ?? item.text}</Typography>
    </Flex>
  );
});
