export interface TypographyType {
  size?: number | string;
  weight?: number;
  color?: string;
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  name?: string;
  opacity?: number;
  spacing?: number | string;
  shadow?: string | number | boolean;
}

export interface TypographyTypes {
  [key: string]: TypographyType;
}

export const LocalTypographicDefinitions = {
  'field-value': { size: 12 },
} satisfies TypographyTypes;

export type TypographyName = keyof typeof LocalTypographicDefinitions;
