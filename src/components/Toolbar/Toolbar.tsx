import { Children, createElement, isValidElement } from 'react';
import { anuxPureFC } from '../../anuxComponents';
import { Theme } from '../../providers/ThemeProvider';
import { Button } from '../Button';
import { Tag } from '../Tag';
import { ToolbarTheme } from './ToolbarTheme';

interface Props {
  className?: string;
  theme?: typeof ToolbarTheme;
  children: React.ReactNode;
}

export const Toolbar = anuxPureFC<Props>('Toolbar', ({
  className,
  theme,
  children: rawChildren = null,
}) => {
  const { classes, join } = useTheme(theme);
  const children = Children.toArray(rawChildren)
    .map(child => {
      if (isValidElement(child) && child.type === Button)
        return createElement(Button, { ...child.props, className: join(child.props.className, classes.button) });
    })
    .removeNull();

  return (
    <Tag name="toolbar" className={join(classes.toolbar, className)}>
      {children}
    </Tag>
  );
});

const useTheme = Theme.createThemeUsing(ToolbarTheme, styles => ({
  toolbar: {
    display: 'flex',
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: styles.backgroundColor,
    padding: 0,
    borderColor: styles.borderColor,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: styles.borderRadius,
    minHeight: 34,
    alignItems: 'center',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },
  button: {
    borderRadius: 0,
  },
}));
