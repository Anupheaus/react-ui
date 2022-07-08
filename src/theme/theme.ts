import { createTheme as createMuiTheme } from '@mui/material/styles';
import { createStyledTag } from './createStyledTag';
import { createStyles as internalCreateStyles } from './createStyles';
import { ThemeStyles, ThemeValues } from './themeModels';

export function createTheme<TValues extends ThemeValues = {}, TStyles extends ThemeStyles = {}>(values: TValues = {} as TValues,
  predefinedStyles: (values: TValues) => TStyles = () => ({}) as TStyles) {
  const createStyles = internalCreateStyles<TValues, TStyles>(values, predefinedStyles);
  const originalTheme = createMuiTheme();
  return {
    createStyles,
    createStyledTag: createStyledTag<TValues, TStyles>(createStyles),
    ...(originalTheme as unknown as {}),
  };
}

class ThemeApiType<TValues extends ThemeValues, TStyles extends ThemeStyles> {
  public get createThemeType() { return createTheme<TValues, TStyles>({} as unknown as TValues, () => ({}) as unknown as TStyles); }
}
export type ThemeApi<TValues extends ThemeValues, TStyles extends ThemeStyles> = ThemeApiType<TValues, TStyles>['createThemeType'];

export const theme = createTheme();

// const theme = createTheme({
//   primary: {
//     textColor: 'red',
//   },
// }, values => ({
//   myOwn: {
//     display: 'flex',
//     flex: 'auto',
//     backgroundColor: values.primary.textColor,
//   },
// }));

// const useStyles = theme.createStyles(theme2 => ({
//   something: {
//     backgroundColor: theme2.values.primary.textColor,
//   },
//   blad: {
//     ...theme2.predefinedStyles.flex.auto,
//   },
// }));

// const { classes, join } = useStyles();
// theme.createStyledTag('something', {
//   tag: {
//     display: 'flex',
//   }
// });

// join(classes.flex.auto, classes.blad);

// const NewTag = theme.createStyledTag('NewTag', theme2=>({
//   ...theme2.predefinedStyles.flex.auto,
// }));
