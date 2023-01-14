import { createTheme, DefaultTheme } from '../../theme';

export const AssistiveLabelTheme = createTheme({
  id: 'AssistiveLabelTheme',
  definition: {
    fontSize: 12,
    fontWeight: 400,
    errorTextColor: DefaultTheme.error.textColor,
  },
});
