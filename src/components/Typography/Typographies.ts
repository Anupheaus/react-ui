export interface TypographyType {
  size?: number;
  weight?: number;
  color?: string;
}

export interface TypographyTypes {
  [key: string]: TypographyType;
}

export const LocalTypographicDefinitions = {

} satisfies TypographyTypes;

export type TypographyName = keyof typeof LocalTypographicDefinitions;
