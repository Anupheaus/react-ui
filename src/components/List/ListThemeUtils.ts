import { ColorTheme, ShadowThemes, UseTheme } from '../../theme';
import { ListTheme } from './ListTheme';

export function useListTheme(useTheme: UseTheme) {
  const { definition: { borders: { color: themeBorderColor, radius: borderRadius }, boxShadow, padding, backgroundColor } } = useTheme(ListTheme);
  const { definition: { primary: { border: { main: mainBorderColor } } } } = useTheme(ColorTheme);
  const { definition: { createSmallInset } } = useTheme(ShadowThemes);

  return {
    borderColor: themeBorderColor ?? mainBorderColor,
    backgroundColor,
    boxShadow: boxShadow ?? createSmallInset(mainBorderColor),
    borderRadius,
    padding,
  };
}