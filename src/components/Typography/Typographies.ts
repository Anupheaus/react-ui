export interface TypographyType {
  size?: number;
  weight?: number;
  color?: string;
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
}

export interface TypographyTypes {
  [key: string]: TypographyType;
}

export const LocalTypographicDefinitions = {
  'field-value': { size: 12 },
} satisfies TypographyTypes;

export type TypographyName = keyof typeof LocalTypographicDefinitions;
