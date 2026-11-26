import { is } from '@anupheaus/common';
import type { ReactElement, RefObject } from 'react';
import { isValidElement, Component } from 'react';
import type { LegacyTheme } from '../theme/themeModels';

declare module '@anupheaus/common' {
  export interface Is {
    reactElement(value: unknown): value is ReactElement<unknown>;
    reactComponent(value: unknown): value is Component;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- public default: callers narrow with is.reactRef(x) and then use x.current untyped; unknown would break them
    reactRef<T = any>(value: unknown): value is RefObject<T>;
    theme<TTheme extends LegacyTheme>(value: TTheme | unknown): value is TTheme;
    theme(value: unknown): value is LegacyTheme;
    fixedCSSDimension(value: string | number | undefined): boolean;
  }
}

function isObjectRef<T = unknown>(value: unknown): value is RefObject<T> {
  return is.plainObject(value) && 'current' in value;
}

is.reactElement = isValidElement;
is.reactRef = isObjectRef;
is.reactComponent = (value): value is Component => value instanceof Component || (typeof (value) === 'object' && value != null && '$$typeof' in value && typeof (value.$$typeof) === 'symbol');
is.theme = (value: unknown): value is LegacyTheme => is.plainObject<LegacyTheme>(value) && is.not.empty(value.id) && is.plainObject(value.definition) && is.function(value.createVariant);
is.fixedCSSDimension = (value: string | number | undefined): boolean => {
  if (is.number(value)) return true;
  if (is.string(value)) return value.endsWith('px') || value.endsWith('em');
  return false;
};
