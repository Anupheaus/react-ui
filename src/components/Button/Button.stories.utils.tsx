import { PrimaryTheme, SecondaryTheme } from '../../../storybook';
import { Theme } from '../../providers/ThemeProvider';
import { ButtonTheme } from './ButtonTheme';

export const PrimaryButtonTheme = ButtonTheme.createVariant({
  styles: {
    backgroundColor: PrimaryTheme.styles.backgroundColor,
    textColor: PrimaryTheme.styles.textColor,
    activeBackgroundColor: Theme.adjustColor(PrimaryTheme.styles.backgroundColor).darken(0.1).toString(),
  },
});

export const SecondaryButtonTheme = ButtonTheme.createVariant({
  styles: {
    backgroundColor: 'transparent',
    textColor: SecondaryTheme.styles.textColor,
    borderColor: SecondaryTheme.styles.backgroundColor,
    activeBackgroundColor: SecondaryTheme.styles.backgroundColor,
  },
});

export const TertiaryButtonTheme = ButtonTheme.createVariant({
  styles: {
    backgroundColor: 'transparent',
    textColor: SecondaryTheme.styles.textColor,
    activeBackgroundColor: SecondaryTheme.styles.backgroundColor,
  },
});