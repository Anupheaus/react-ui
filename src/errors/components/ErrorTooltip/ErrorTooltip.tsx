import { ReactNode } from 'react';
import { Tooltip, TooltipTheme } from '../../../components/Tooltip';
import { createComponent } from '../../../components/Component';
import { createStyles, ThemesProvider } from '../../../theme';
import { AnuxError } from '../../types';
import { ErrorTooltipTheme } from './ErrorTooltipTheme';
import { Flex } from '../../../components/Flex';

interface Props {
  error: AnuxError;
  children?: ReactNode;
}

const useStyles = createStyles(({ useTheme, createThemeVariant }) => {
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
