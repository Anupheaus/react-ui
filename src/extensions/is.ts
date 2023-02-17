import { is } from '@anupheaus/common';
import { isValidElement, Component, ReactElement, RefObject } from 'react';
import { Component as AnuxComponent, ComponentSymbol } from '../components/Component';
import type { Theme } from '../theme';

declare module '@anupheaus/common' {
  export interface Is {
    reactElement(value: unknown): value is ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;
    reactComponent(value: unknown): value is Component;
    reactRef<T = any>(value: unknown): value is RefObject<T>;
    anuxComponent<T extends AnuxComponent>(value: T | unknown): value is T;
    theme<TTheme extends Theme>(value: TTheme | unknown): value is TTheme;
    theme(value: unknown): value is Theme;
  }
}

function isObjectRef<T = any>(value: unknown): value is RefObject<T> {
  return is.plainObject(value) && 'current' in value;
}

is.reactElement = isValidElement;
is.reactRef = isObjectRef;
is.reactComponent = (value): value is Component => value instanceof Component;
is.theme = (value: unknown): value is Theme => is.plainObject<Theme>(value) && is.not.empty(value.id) && is.plainObject(value.definition) && is.function(value.createVariant);
is.anuxComponent = <T extends AnuxComponent>(value: T | unknown): value is T => is.reactComponent(value) && is.function(value) && (value as any)[ComponentSymbol] === true;
