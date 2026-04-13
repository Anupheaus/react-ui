import { ReactNode } from 'react';
import { Tooltip } from '../../../components/Tooltip';
import { createComponent } from '../../../components/Component';
import { createStyles, ThemeProvider } from '../../../theme';
import { Flex } from '../../../components/Flex';
import { Error } from '@anupheaus/common';

interface Props {
  error: Error;
  children?: ReactNode;
}

const useStyles = createStyles(({ errorTooltip }) => ({
  errorTitle: {
    fontSize: errorTooltip.titleFontSize,
    fontWeight: errorTooltip.titleFontWeight,
  },
  errorMessage: {
    fontSize: errorTooltip.messageFontSize,
    fontWeight: errorTooltip.messageFontWeight,
  },
}));

export const ErrorTooltip = createComponent('ErrorTooltip', ({
  error,
  children = null,
}: Props) => {
  const { css, alterTheme } = useStyles();
  const tooltipTheme = alterTheme(theme => ({
    tooltip: {
      ...theme.tooltip,
      backgroundColor: theme.errorTooltip.backgroundColor,
      textColor: theme.errorTooltip.textColor,
      fontSize: theme.errorTooltip.messageFontSize,
      fontWeight: theme.errorTooltip.messageFontWeight,
    },
  }));
  return (
    <ThemeProvider theme={tooltipTheme}>
      <Tooltip
        showArrow
        content={(
          <Flex tagName="error-tooltip" isVertical gap={8}>
            <Flex tagName="error-tooltip-title" className={css.errorTitle}>{error.title}</Flex>
            <Flex tagName="error-tooltip-message" className={css.errorMessage}>{error.message}</Flex>
          </Flex>
        )}
      >
        {children}
      </Tooltip>
    </ThemeProvider>
  );
});
