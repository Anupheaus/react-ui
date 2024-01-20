import { CSSProperties } from 'react';

interface ThemeStateConfig {
  normal: CSSProperties;
  active: CSSProperties;
  disabled: CSSProperties;
}

export interface Theme {
  text: {
    primary: CSSProperties;
    secondary: CSSProperties;
  };
  animation: CSSProperties;
  transition: CSSProperties;
  action: ThemeStateConfig;
  menu: {
    normal: CSSProperties;
    disabled: CSSProperties;

    menuItem: ThemeStateConfig;
  };
  toolbar: ThemeStateConfig & {
    title?: CSSProperties;
    content?: CSSProperties;
  };
  field: {
    label: ThemeStateConfig;
    value: ThemeStateConfig;
    assistiveText: CSSProperties;
  };
  error: CSSProperties;
  surface: {
    general: ThemeStateConfig;
    asAContainer: ThemeStateConfig;
    titleArea: ThemeStateConfig;
    shadows: {
      light: CSSProperties;
      medium: CSSProperties;
      heavy: CSSProperties;
    };
  };
  scrollbars: {
    thumb: ThemeStateConfig;
    track: ThemeStateConfig;
  };
  dataPaletteColors: string[];
  skeleton: CSSProperties;
  icon: ThemeStateConfig;
  activePseudoClasses: string;
}
