import { ReactNode } from 'react';
import { Tooltip, TooltipTheme } from '../../../components/Tooltip';
import { createComponent } from '../../../components/Component';
import { createLegacyStyles, ThemesProvider } from '../../../theme';
import { ErrorTooltipTheme } from './ErrorTooltipTheme';
import { Flex } from '../../../components/Flex';
import { Error } from '@anupheaus/common';

interface Props {
  error: Error;
  children?: ReactNode;
}

const useStyles = createLegacyStyles(({ useTheme, createThemeVariant }) => {
  const { backgroundColor, textColor, messageFontSize, messageFontWeight, titleFontSize, titleFontWeight } = useTheme(ErrorTooltipTheme);
  return {
    styles: {
      errorTitle: {
        fontSize: titleFontSize,
        fontWeight: titleFontWeight,
      },
      errorMessage: {
        fontSize: messageFontSize,
        fontWeight: messageFontWeight,
      },
    },
    variants: {
      errorTooltipVariant: createThemeVariant(TooltipTheme, {
        backgroundColor,
        fontSize: messageFontSize,
        fontWeight: messageFontWeight,
        textColor,
      }),
    },
  };
});

export const ErrorTooltip = createComponent('ErrorTooltip', ({
  error,
  children = null,
}: Props) => {
  const { css, variants, join } = useStyles();
  return (
    <ThemesProvider themes={join(variants.errorTooltipVariant)}>
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
    </ThemesProvider>
  );
});
