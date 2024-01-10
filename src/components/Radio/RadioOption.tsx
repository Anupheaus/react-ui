import { is } from '@anupheaus/common';
import { KeyboardEvent } from 'react';
import { DistributedState, useBound, useDistributedState } from '../../hooks';
import { ReactListItem } from '../../models';
import { useUIState } from '../../providers';
import { createStyles2 } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { useRipple } from '../Ripple';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';

const useStyles = createStyles2(({ animation, field: { default: defaultField, active: activeField, value: fieldValue }, activePseudoClasses }) => ({
  radio: {
    ...defaultField,
    ...fieldValue,
    cursor: 'pointer',

    '&.is-loading, &.is-read-only': {
      cursor: 'default',
    },
  },
  radioGraphicContainer: {
    position: 'relative',
    display: 'flex',
    flex: 'none',
    width: 20,
    height: 20,
  },
  radioGraphic: {
    ...defaultField,
    ...animation,
    position: 'relative',
    display: 'flex',
    flex: 'none',
    width: 16,
    height: 16,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: '50%',
    transitionProperty: 'border-color',
    '--radio-graphic-color': defaultField.borderColor,

    [activePseudoClasses]: {
      '&:not(.is-read-only)': {
        ...activeField,
        '--radio-graphic-color': activeField.borderColor,
      },
    },
  },
  toggledRadioGraphic: {
    '&::after': {
      ...animation,
      content: '""',
      position: 'absolute',
      inset: 3,
      backgroundColor: 'var(--radio-graphic-color)',
      borderRadius: '50%',
      overflow: 'hidden',
      transitionProperty: 'background-color',
    },
  },
  ripple: {
    inset: -4,
    borderRadius: '50%',
  },
  value: {
    padding: '2px 0 0',
  },
}));

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
    <Flex ref={rippleTarget} tagName="radio" valign="center" align="left" disableGrow className={join(css.radio, isLoading && 'is-loading', isReadOnly && 'is-read-only')} gap={4} allowFocus
      onClickCapture={handleClick} onKeyUp={handleKeyUp}>
      <Tag name="radio-graphic-container" className={css.radioGraphicContainer}>
        <Ripple stayWithinContainer ignoreMouseCoords className={css.ripple} />
        <Skeleton type="circle">
          <Tag name="radio-graphic" className={join(css.radioGraphic, isSelected && css.toggledRadioGraphic, isReadOnly && 'is-read-only')} />
        </Skeleton>
      </Tag>
      {is.not.empty(item.iconName) && <Icon name={item.iconName} size={'small'} />}
      <Skeleton type="text"><Tag name="radio-value" className={css.value}>{item.label ?? item.text}</Tag></Skeleton>
    </Flex>
  );
});
