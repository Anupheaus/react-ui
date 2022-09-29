import { Children, createElement, isValidElement } from 'react';
import { pureFC } from '../../anuxComponents';
import { Tag } from '../Tag';
import { ToolbarTheme } from './ToolbarTheme';

interface Props {
  className?: string;
  theme?: typeof ToolbarTheme;
  children: React.ReactNode;
}

export const Toolbar = pureFC<Props>()('Toolbar', ToolbarTheme, ({ backgroundColor, borderColor, borderRadius }) => ({
  toolbar: {
    display: 'flex',
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor,
    padding: 0,
    borderColor,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius,
    minHeight: 34,
    alignItems: 'center',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },
  toolbarItem: {
    borderRadius: 0,
  },
}), ({
  className,
  theme: {
    css,
    join,
  },
  children: rawChildren = null,
}) => {
  const children = Children.toArray(rawChildren)
    .map((child, index) => {
      if (isValidElement(child)) {
        return createElement(child.type, { key: `toolbar-item-${index}`, ...child.props, className: join(child.props.className, css.toolbarItem) });
      }
    })
    .removeNull();

  return (
    <Tag name="toolbar" className={join(css.toolbar, className)}>
      {children}
    </Tag>
  );
});
