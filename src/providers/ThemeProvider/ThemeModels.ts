import { MapOf } from 'anux-common';
import { ReactNode } from 'react';
import { CSSObject } from 'tss-react';

export type ThemeStyles = CSSObject;
export type ThemeClassStyles = Record<string, ThemeStyles>;

export interface IconDefinitionProps {
  size?: 'normal' | 'small' | 'large' | number;
}

export type IconDefinition = (props: IconDefinitionProps) => ReactNode;

export type IconDefinitions = {
  [iconName: string]: IconDefinition;
};

export interface IconType {

}

export interface TypographyDefinition {
  size?: number | string;
  weight?: number | string;
}

export interface TypographyDefinitions {
  [name: string]: TypographyDefinition;
}

export interface ThemeType {
  styles: MapOf<string | number>;
  icons?: IconDefinitions;
}