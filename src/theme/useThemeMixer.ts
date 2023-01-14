export function useThemeMixer<T>(theme: 'primary' | 'secondary' | undefined, primaryValue: T, secondaryValue: T, defaultValue: T) {
  if (theme === 'primary') return primaryValue;
  if (theme === 'secondary') return secondaryValue;
  return defaultValue;
}