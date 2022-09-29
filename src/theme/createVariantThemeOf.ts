// export function createVariantThemeOf<TParentTheme extends Theme>(parentTheme?: TParentTheme) {
//   <TTheme extends Theme>(theme: TTheme, variant: ThemeVariant) {
//   const themeVariant = theme.variants[variant];
//   if (!themeVariant) {
//     throw new Error(`Variant ${variant} not found in theme`);
//   }
//   return {
//     ...theme,
//     ...themeVariant,
//   };
// }