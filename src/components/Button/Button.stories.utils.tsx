// import { PrimaryTheme, SecondaryTheme } from '../../../storybook';
// import { createTheme } from '../../theme';

import { colors } from '../../theme';
import { ButtonTheme } from './ButtonTheme';

// export const primaryButtonTheme = createTheme(theme => ({
//   components: {
//     button: {
//       backgroundColor: theme.components.button.backgroundColor,
//       textColor: PrimaryTheme.styles.textColor,
//       activeBackgroundColor: Theme.adjustColor(PrimaryTheme.styles.backgroundColor).darken(0.1).toString(),
//     },
//   },
// }));

// export const secondaryButtonTheme = createTheme({
//   button: {
//     backgroundColor: 'transparent',
//     textColor: SecondaryTheme.styles.textColor,
//     borderColor: SecondaryTheme.styles.backgroundColor,
//     activeBackgroundColor: SecondaryTheme.styles.backgroundColor,
//   },
// });

// export const tertiaryButtonTheme = createTheme({
//   button: {
//     backgroundColor: 'transparent',
//     textColor: SecondaryTheme.styles.textColor,
//     activeBackgroundColor: SecondaryTheme.styles.backgroundColor,
//   },
// });

export const PrimaryButtonTheme = ButtonTheme.createVariant({
  definition: {
    default: {
      backgroundColor: '#007bff',
      textColor: '#fff',
    },
    active: {
      backgroundColor: colors.darken('#007bff', 10),
    },
  },
});