import type { ReactNode } from 'react';
import { Children, createElement, isValidElement } from 'react';
import { createStyles, ThemeProvider } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Typography } from '../Typography';

const useStyles = createStyles(({ transition, toolbar: { normal, active, title, content }, activePseudoClasses }) => ({
  titlebar: {
    ...transition,
    minHeight: 40,
    zIndex: 1000,
    ...normal,

    [activePseudoClasses]: active,
  },
  title: {
    ...title,
  },
  content: {
    ...content,
  },
  endAdornment: {
    ...content,
  },
}));

interface Props {
  className?: string;
  icon?: ReactNode;
  title?: ReactNode;
  endAdornment?: ReactNode;
  children?: ReactNode;
}

export const Titlebar = createComponent('Titlebar', ({
  className,
  icon,
  title,
  endAdornment,
  children: rawChildren = null,
  ...props
}: Props) => {
  const { css, alterTheme, join } = useStyles();
  const children = Children.toArray(rawChildren)
    .map((child, index) => {
      if (isValidElement(child)) return createElement(child.type, { key: `titlebar-item-${index}`, ...child.props });
    })
    .removeNull();

  const actionTheme = alterTheme(() => ({
    action: {
      normal: {
        backgroundColor: 'transparent',
      },
      active: {
        backgroundColor: 'rgba(0 0 0 / 10%)',
      },
    },
  }));

  return (
    <Flex {...props} tagName="titlebar" className={join(css.titlebar, className)} valign="center" disableGrow>
      <ThemeProvider theme={actionTheme}>
        {icon}
        {title != null && <Typography tagName="titlebar-title" className={css.title} valign="center">{title}</Typography>}
        <Flex tagName="titlebar-content" className={css.content} valign="center">{children}</Flex>
        {endAdornment != null && <Flex tagName="titlebar-end-adornment" className={css.endAdornment} disableGrow valign="center">{endAdornment}</Flex>}
      </ThemeProvider>
    </Flex>
  );
});
