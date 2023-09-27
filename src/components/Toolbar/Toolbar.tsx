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

const useStyles = createStyles(({ useTheme, createThemeVariant, activePseudoClasses }) => {
  const { default: { backgroundColor, borderColor, borderRadius, textColor }, active } = useTheme(ToolbarTheme);
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
        minHeight: 30,
        alignItems: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        transitionProperty: 'border-color, background-color, color',
        transitionDuration: '0.4s',
        transitionTimingFunction: 'ease',

        [activePseudoClasses]: {
          backgroundColor: active.backgroundColor,
          borderColor: active.borderColor,
          color: active.textColor,
        },
      },
      toolbarItem: {
        borderRadius: 0,
      },
    },
    variants: {
      iconButtonTheme: createThemeVariant(IconButtonTheme, {
        default: {
          backgroundColor,
          textColor,
          borderColor: 'transparent',
        },
        borderRadius: 0,
      }),
      buttonTheme: createThemeVariant(ButtonTheme, {
        default: {
          backgroundColor,
          textColor,
          borderColor: 'transparent',
        },
        borderRadius: 0,
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
