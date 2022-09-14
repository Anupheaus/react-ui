import { createMakeStyles } from 'tss-react';
import color from 'color';
import { IconsFactory } from './IconsFactory';
import { createThemeFor } from './createThemeFor';
import { createThemeUsing } from './createThemeUsing';
import { createInlineStylesVersionOf } from './createInlineStylesVersionOf';
import { createAnimationKeyFrame } from './createAnimationKeyFrame';

const { makeStyles } = createMakeStyles({ useTheme: () => ({}) });

export type MakeStyles = typeof makeStyles;

export const Theme = {
  adjustColor: color,
  createThemeFor: createThemeFor(makeStyles),
  createThemeUsing: createThemeUsing(makeStyles),
  createInlineStylesVersionOf: createInlineStylesVersionOf(),
  createAnimationKeyFrame: createAnimationKeyFrame(),
  icons: IconsFactory,
};
