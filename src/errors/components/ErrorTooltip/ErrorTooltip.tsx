import { pureFC } from '../../../anuxComponents';
import { Flex, Tooltip } from '../../../components';
import { AnuxError } from '../../types';
import { ErrorTooltipTheme } from './ErrorTooltipTheme';

interface Props {
  error: AnuxError;
}

export const ErrorTooltip = pureFC<Props>()('ErrorTooltip', ErrorTooltipTheme, ({ backgroundColor, textColor, messageFontSize, messageFontWeight, titleFontSize, titleFontWeight }) => ({
  errorTooltip: {
    backgroundColor,
    color: textColor,
  },
  errorTitle: {
    fontSize: titleFontSize,
    fontWeight: titleFontWeight,
  },
  errorMessage: {
    fontSize: messageFontSize,
    fontWeight: messageFontWeight,
  },
}), ({
  error,
  theme: {
    css,
    ThemedComponent,
  },
  children = null,
}) => {
  return <ThemedComponent
    component={Tooltip}
    themeDefinition={({ backgroundColor, textColor }) => ({ backgroundColor, textColor })}
    showArrow
    content={(
      <Flex tagName="error-tooltip" isVertical gap={8}>
        <Flex tagName="error-tooltip-title" className={css.errorTitle}>{error.title}</Flex>
        <Flex tagName="error-tooltip-message" className={css.errorMessage}>{error.message}</Flex>
      </Flex>
    )}
  >
    {children}
  </ThemedComponent>;
});