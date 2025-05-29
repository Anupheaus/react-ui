import type { ReactNode } from 'react';
import { useContext, useState } from 'react';
import { useBooleanState, useBound, useDOMRef } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { useRipple } from '../Ripple';
import { PopupMenuContext } from './PopupMenuContext';
import { SubMenuProvider } from './SubMenuProvider';
import { Skeleton } from '../Skeleton';
import { is } from '@anupheaus/common';

const useStyles = createStyles(({
  buttons: { hover: { normal: normalButton, active: activeButton } },
  fields: { content: { normal: normalFieldContent }, value: { normal: normalField, active: activeField } },
  pseudoClasses
}, { applyTransition }) => ({
  menuItem: {
    position: 'relative',
    padding: 8,
    cursor: 'pointer',
    ...normalField,
    ...normalButton,
    ...applyTransition('background-color, color'),

    [pseudoClasses.active]: {
      ...activeField,
      ...activeButton,
    },

    [pseudoClasses.readOnly]: {
      cursor: 'default',
      transition: 'none',
      pointerEvents: 'none',
    },

    '&.is-element-content': {
      gap: 4,
      alignItems: 'center',
    },

    '@media(pointer: coarse)': {
      margin: 4,
      borderRadius: normalFieldContent.borderRadius,
      border: `1px solid ${normalFieldContent.borderColor}`,

      '@media(max-height: 800px)': {
        width: 'fit-content',
        minHeight: 60,
        alignItems: 'center',
      },
    },
  },
  subMenuIcon: {
    marginLeft: 4,
  }
}));

interface Props {
  className?: string;
  isReadOnly?: boolean;
  children: ReactNode;
  testId?: string;
  onSelect?(): void;
}

export const MenuItem = createComponent('MenuItem', ({
  className,
  isReadOnly = false,
  testId,
  children,
  onSelect,
}: Props) => {
  const { css, theme, join } = useStyles();
  const { Ripple, rippleTarget } = useRipple();
  const [isOver, setIsOver, setIsNotOver] = useBooleanState(false);
  const [element, setElement] = useState<HTMLDivElement>();
  const target = useDOMRef([rippleTarget, setElement]);
  const [hasSubMenu, setHasSubMenu] = useState(false);
  const { isValid, close } = useContext(PopupMenuContext);

  const handleSelect = useBound(() => {
    if (isValid) {
      close();
      setTimeout(() => onSelect?.(), theme.transitions.duration);
    } else {
      onSelect?.();
    }
  });

  return (
    <Flex
      tagName="menu-item"
      ref={target}
      className={join(css.menuItem, isReadOnly && 'is-read-only', !is.string(children) && 'is-element-content', className)}
      allowFocus
      onMouseOver={setIsOver}
      onMouseEnter={setIsOver}
      onMouseLeave={setIsNotOver}
      onMouseOut={setIsNotOver}
      onClickCapture={handleSelect}
      disableGrow
      testId={testId}
    >
      <Ripple stayWithinContainer />
      <SubMenuProvider element={element} isVisible={isOver} onHasSubMenu={setHasSubMenu}>
        {is.string(children) ? (
          <Skeleton type={'text'}>{children}</Skeleton>
        ) : children}
        {hasSubMenu && <Icon name="sub-menu" size="small" className={css.subMenuIcon} />}
      </SubMenuProvider>
    </Flex>
  );
});