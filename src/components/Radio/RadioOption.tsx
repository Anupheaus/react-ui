import { is } from '@anupheaus/common';
import type { KeyboardEvent } from 'react';
import type { DistributedState } from '../../hooks';
import { useBound, useDistributedState } from '../../hooks';
import { ReactListItem } from '../../models';
import { useUIState } from '../../providers';
import { createStyles } from '../../theme';
import type { Theme } from '../../theme/themes';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { useRipple } from '../Ripple';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import { Typography } from '../Typography';
import { HelpInfo } from '../HelpInfo';

function mergeRadioOptionTheme(
  radio: Theme['radio'],
  state: 'normal' | 'readOnly',
) {
  const { normal, readOnly } = radio?.option ?? {};
  return { ...normal, ...(state === 'readOnly' ? readOnly : {}) };
}

const useStyles = createStyles(({ fields: { content: { normal } }, radio, pseudoClasses }) => {
  const defaultOuterCircleBorderColor = normal.borderColor;
  const defaultInnerDotBackgroundColor = normal.borderColor;
  const normalOptionTheme = mergeRadioOptionTheme(radio, 'normal');
  const readOnlyOptionTheme = mergeRadioOptionTheme(radio, 'readOnly');

  return {
    radio: {
      cursor: 'pointer',
    },
    radioReadOnly: {
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
      alignItems: 'center',
      justifyContent: 'center',

      [pseudoClasses.tablet]: {
        width: 30,
        height: 30,
      },
    },
    radioGraphic: {
      position: 'relative',
      display: 'flex',
      flex: 'none',
      width: 16,
      height: 16,
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: normalOptionTheme.outerCircleBorderColor ?? defaultOuterCircleBorderColor,
      ...(normalOptionTheme.outerCircleBackgroundColor != null
        ? { backgroundColor: normalOptionTheme.outerCircleBackgroundColor }
        : {}),
      borderRadius: '50%',

      [pseudoClasses.tablet]: {
        width: 26,
        height: 26,
        borderWidth: 4,
      },
    },
    radioGraphicReadOnly: {
      borderColor: readOnlyOptionTheme.outerCircleBorderColor
        ?? normalOptionTheme.outerCircleBorderColor
        ?? defaultOuterCircleBorderColor,
      ...(readOnlyOptionTheme.outerCircleBackgroundColor != null
        ? { backgroundColor: readOnlyOptionTheme.outerCircleBackgroundColor }
        : normalOptionTheme.outerCircleBackgroundColor != null
          ? { backgroundColor: normalOptionTheme.outerCircleBackgroundColor }
          : {}),
    },
    toggledRadioGraphic: {
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 3,
        backgroundColor: normalOptionTheme.innerDotBackgroundColor ?? defaultInnerDotBackgroundColor,
        borderRadius: '50%',
        overflow: 'hidden',
      },
    },
    toggledRadioGraphicReadOnly: {
      '&::after': {
        backgroundColor: readOnlyOptionTheme.innerDotBackgroundColor
          ?? normalOptionTheme.innerDotBackgroundColor
          ?? defaultInnerDotBackgroundColor,
      },
    },
    ripple: {
      inset: -4,
      borderRadius: '50%',
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
    item.onSelectChange?.(ReactListItem.createEvent(item), !isSelected);
  });

  const handleKeyUp = useBound((event: KeyboardEvent<HTMLDivElement>) => {
    if (isReadOnly || isLoading) return;
    if (![' ', 'Enter'].includes(event.key)) return;
    set(item.id);
    item.onSelectChange?.(ReactListItem.createEvent(item), !isSelected);
  });

  return (
    <Flex ref={rippleTarget} tagName="radio" valign="center" align="left" disableGrow className={join(isReadOnly ? css.radioReadOnly : css.radio, isLoading && css.isLoading)} gap={4} allowFocus
      onClickCapture={handleClick} onKeyUp={handleKeyUp}>
      <Tag name="radio-graphic-container" className={css.radioGraphicContainer}>
        <Ripple stayWithinContainer ignoreMouseCoords containerClassName={css.ripple} />
        <Skeleton type="circle">
          <Tag name="radio-graphic" className={join(
            css.radioGraphic,
            isReadOnly && css.radioGraphicReadOnly,
            isSelected && css.toggledRadioGraphic,
            isSelected && isReadOnly && css.toggledRadioGraphicReadOnly,
          )} />
        </Skeleton>
      </Tag>
      {is.not.empty(item.iconName) && <Icon name={item.iconName} size={'small'} />}
      <Typography type="field-value">{item.label ?? item.text}</Typography>
      {item.help != null && <HelpInfo>{item.help}</HelpInfo>}
    </Flex>
  );
});
