import { CSSProperties } from 'react';

interface ThemeStateConfig {
  normal: CSSProperties;
  active: CSSProperties;
  disabled: CSSProperties;
}

interface ButtonTheme {
  backgroundColor: string;
  borderColor?: string;
  borderRadius: number;
  textColor?: string;
  textSize?: string | number;
}

interface TextTheme {
  family: string;
  size: string | number;
  weight: string | number;
  color: string;
}

interface FieldLabelTheme {
  textSize?: string | number;
  textColor?: string;
  textWeight?: string | number;
}

interface FieldContentTheme {
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;
  textSize?: string | number;
  textColor?: string;
}

interface FieldValueTheme {
  textSize?: string | number;
  textColor?: string;
}

interface WindowTheme {
  backgroundColor: string;
  borderRadius: number;
  shadow: string;
  filter: string;
}

interface WindowContentTheme {
  backgroundColor?: string;
  textSize?: string | number;
  textColor?: string;
  textWeight?: string | number;
}

interface GapsTheme {
  fields: number;
}

interface ListTheme {
  backgroundColor?: string;
  textColor?: string;
  textSize?: string | number;
  gap?: number | keyof GapsTheme;
}

interface ListItemTheme {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: string | number;
  borderRadius?: string | number;
  textColor?: string;
  textSize?: string | number;
  textWeight?: string | number;
  padding?: string | number;
}

interface DropDownTheme {
  backgroundColor?: string;
  textColor?: string;
  textSize?: string | number;
  gap?: number | keyof GapsTheme;
}

interface ChipsTheme {
  backgroundColor?: string;
  textColor?: string;
  textSize?: string | number;
  textWeight?: string | number;
  gap?: number | keyof GapsTheme;
}

interface ChipTheme {
  backgroundColor?: string;
  textColor?: string;
  textSize?: string | number;
  textWeight?: string | number;
  padding?: string | number;
  borderRadius?: string | number;
}

interface AvatarTheme {
  backgroundColor?: string;
  textColor?: string;
  textWeight?: string | number;
  opacity?: number;
  shadow?: boolean | string;
}

interface ShadowsTheme {
  veryLight: CSSProperties['boxShadow'];
  light: CSSProperties['boxShadow'];
  medium: CSSProperties['boxShadow'];
  heavy: CSSProperties['boxShadow'];
  veryHeavy: CSSProperties['boxShadow'];
}

interface IconTheme {
  opacity: number;
}

export interface Theme {
  buttons: {
    default: {
      normal: ButtonTheme;
      active: Partial<ButtonTheme>;
      disabled: Partial<ButtonTheme>;
    };
    bordered: {
      normal: ButtonTheme;
      active: Partial<ButtonTheme>;
      disabled: Partial<ButtonTheme>;
    };
    hover: {
      normal: ButtonTheme;
      active: Partial<ButtonTheme>;
      disabled: Partial<ButtonTheme>;
    };
  },
  text: TextTheme;
  fields: {
    label: {
      normal: FieldLabelTheme;
      active: Partial<FieldLabelTheme>;
      readOnly: Partial<FieldLabelTheme>;
    };
    content: {
      normal: FieldContentTheme;
      active: Partial<FieldContentTheme>;
      readOnly: Partial<FieldContentTheme>;
    };
    value: {
      normal: FieldValueTheme;
      active: Partial<FieldValueTheme>;
      readOnly: Partial<FieldValueTheme>;
    };
  };
  windows: {
    window: {
      active: WindowTheme;
      inactive: Partial<WindowTheme>;
    };
    content: {
      active: WindowContentTheme;
      inactive: Partial<WindowContentTheme>;
    };
  };
  transitions: {
    duration: number;
    function: CSSProperties['transitionTimingFunction'];
  };
  list: {
    normal: ListTheme;
    active: Partial<ListTheme>;
    readOnly: Partial<ListTheme>;

    item: {
      normal: ListItemTheme;
      active: Partial<ListItemTheme>;
      readOnly: Partial<ListItemTheme>;
    };

    selectableItem: {
      normal: ListItemTheme;
      active: Partial<ListItemTheme>;
      readOnly: Partial<ListItemTheme>;
    };
  };
  dropDown: {
    normal: DropDownTheme;
    active: Partial<DropDownTheme>;
    readOnly: Partial<DropDownTheme>;
  };
  pseudoClasses: {
    active: string;
    readOnly: string;
  };
  chips: {
    normal: ChipsTheme;
    active: Partial<ChipsTheme>;
    readOnly: Partial<ChipsTheme>;

    chip: {
      normal: ChipTheme;
      active: Partial<ChipTheme>;
      readOnly: Partial<ChipTheme>;
    };
  };
  avatar: {
    normal: AvatarTheme;
    active: Partial<AvatarTheme>;
    readOnly: Partial<AvatarTheme>;
  };
  shadows: ShadowsTheme;
  icons: {
    normal: IconTheme;
    active: Partial<IconTheme>;
    readOnly: Partial<IconTheme>;
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
  gaps: GapsTheme;
  dataPaletteColors: string[];
  skeleton: CSSProperties;
  icon: ThemeStateConfig;

  /** @deprecated */
  activePseudoClasses: string;
}
