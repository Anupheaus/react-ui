import type { PureFC, PureRef } from '../anuxComponents';
import type { AddChildren } from '../extensions';
import { GetThemeDefinition, Theme, ThemeDefinition, ThemeIcons } from './themeModels';
import { ThemesProvider, useThemeFromThemesProvider } from './ThemesProvider';

type Props<P, T extends Theme, OD extends ThemeDefinition> = P & {
  component: PureFC<P, HTMLElement, T>;
  themeDefinition(definition: OD): Partial<GetThemeDefinition<T>>;
};

export function createThemedComponent<OD extends ThemeDefinition, I extends ThemeIcons>(theme: Theme<OD, I>) {
  return <P, T extends Theme>({ component: Component, themeDefinition: themeFunc, ...otherProps }: AddChildren<Props<P, T, OD>>, ref: PureRef) => {
    const componentTheme = Component.theme;
    if (componentTheme == null) throw new Error(`The component '${Component.name}' does not have a theme defined.`);
    const newTheme = useThemeFromThemesProvider(componentTheme as T, themeFunc(theme.definition));
    let content = <Component {...otherProps as any} ref={ref} />;
    if (newTheme != null) content = (
      <ThemesProvider themes={[newTheme]}>
        {content}
      </ThemesProvider>
    );
    return content;
  };
}

class GetThemedComponent<D extends ThemeDefinition, I extends ThemeIcons> { public Func() { return createThemedComponent<D, I>(null as unknown as Theme<D, I>); } }
export type ThemedComponent<D extends ThemeDefinition, I extends ThemeIcons> = ReturnType<GetThemedComponent<D, I>['Func']>;
