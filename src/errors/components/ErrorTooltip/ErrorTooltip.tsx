import { ReactNode } from 'react';
import { Tooltip, TooltipTheme } from '../../../components/Tooltip';
import { createComponent } from '../../../components/Component';
import { ThemesProvider } from '../../../theme';
import { AnuxError } from '../../types';
import { ErrorTooltipTheme } from './ErrorTooltipTheme';
import { Flex } from '../../../components/Flex';

interface Props {
  error: AnuxError;
  children?: ReactNode;
}

export const ErrorTooltip = createComponent({
  id: 'ErrorTooltip',

  styles: ({ useTheme, createThemeVariant }) => {
    const { definition: { backgroundColor, textColor, messageFontSize, messageFontWeight, titleFontSize, titleFontWeight } } = useTheme(ErrorTooltipTheme);
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
  },

  render({
    error,
    children = null,
  }: Props, { css, variants, join }) {
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
  },
});
