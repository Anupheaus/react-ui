import { Children, createElement, isValidElement, ReactNode } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { ToolbarTheme } from './ToolbarTheme';

interface Props {
  className?: string;
  theme?: typeof ToolbarTheme;
  children: ReactNode;
}

export const Toolbar = createComponent({
  id: 'Toolbar',

  styles: ({ useTheme }) => {
    const { definition: { backgroundColor, borderColor, borderRadius } } = useTheme(ToolbarTheme);
    return {
      styles: {
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
      },
    };
  },

  render({
    className,
    children: rawChildren = null,
  }: Props, { css, join }) {
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
  },
});
