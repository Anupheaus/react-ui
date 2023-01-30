import { Children, createElement, isValidElement, ReactNode } from 'react';
import { createStyles, ThemesProvider } from '../../theme';
import { ButtonTheme, IconButtonTheme } from '../Button';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { ToolbarTheme } from './ToolbarTheme';

interface Props {
  className?: string;
  theme?: typeof ToolbarTheme;
  children: ReactNode;
}

const useStyles = createStyles(({ useTheme, createThemeVariant }) => {
  const { backgroundColor, borderColor, borderRadius, textColor } = useTheme(ToolbarTheme);
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
    variants: {
      iconButtonTheme: createThemeVariant(IconButtonTheme, {
        backgroundColor,
        borderColor,
        borderRadius: 0,
        textColor,
      }),
      buttonTheme: createThemeVariant(ButtonTheme, {
        backgroundColor,
        borderColor,
        borderRadius: 0,
        textColor,
      }),
    },
  };
});

export const Toolbar = createComponent('Toolbar', ({
  className,
  children: rawChildren = null,
}: Props) => {
  const { css, variants, join } = useStyles();
  const children = Children.toArray(rawChildren)
    .map((child, index) => {
      if (isValidElement(child)) {
        return createElement(child.type, { key: `toolbar-item-${index}`, ...child.props, className: join(child.props.className, css.toolbarItem) });
      }
    })
    .removeNull();

  return (
    <Tag name="toolbar" className={join(css.toolbar, className)}>
      <ThemesProvider themes={join(variants.iconButtonTheme, variants.buttonTheme)}>
        {children}
      </ThemesProvider>
    </Tag>
  );
});
