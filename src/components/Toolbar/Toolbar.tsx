import { Children, createElement, isValidElement, ReactNode } from 'react';
import { createStyles2 } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { useUIState } from '../../providers';

interface Props {
  className?: string;
  children: ReactNode;
}

const useStyles = createStyles2(({ activePseudoClasses, toolbar: { default: defaultToolbar, active: activeToolbar } }) => ({
  toolbar: {
    ...defaultToolbar,
    display: 'flex',
    flexGrow: 0,
    flexShrink: 0,
    padding: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    minHeight: 30,
    alignItems: 'center',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    transitionProperty: 'border-color, background-color, color',
    transitionDuration: '0.4s',
    transitionTimingFunction: 'ease',

    [activePseudoClasses]: {
      ...activeToolbar,
    },

    '&.is-compact': {
      minHeight: 16,
    },

    '& button.is-icon-only': {
      borderRadius: 0,
    },
  },
  toolbarItem: {
    borderRadius: 0,
  },

}));

export const Toolbar = createComponent('Toolbar', ({
  className,
  children: rawChildren = null,
}: Props) => {
  const { css, join } = useStyles();
  const { isCompact } = useUIState();

  const children = Children.toArray(rawChildren)
    .map((child, index) => {
      if (isValidElement(child)) {
        return createElement(child.type, { key: `toolbar-item-${index}`, ...child.props, className: join(child.props.className, css.toolbarItem) });
      }
    })
    .removeNull();

  return (
    <Tag name="toolbar" className={join(css.toolbar, isCompact && 'is-compact', className)}>
      {children}
    </Tag>
  );
});
