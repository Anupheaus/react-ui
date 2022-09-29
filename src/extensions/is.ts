import { AnyObject, is } from 'anux-common';

import { isValidElement, Component, ReactElement } from 'react';
import { PureFC } from '../anuxComponents';
import type { Theme } from '../theme';

declare module 'anux-common' {
  export interface Is {
    reactElement(value: unknown): value is ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;
    reactComponent(value: unknown): value is Component;
    pureFC<T extends PureFC<AnyObject>>(value: T | unknown): value is T;
    pureFC(value: unknown): value is PureFC<AnyObject>;
    pureFCWithTheme<TTheme extends Theme, TPureFC extends PureFC<AnyObject, HTMLElement, TTheme>>(value: TPureFC | unknown): value is TPureFC;
    pureFCWithTheme(value: unknown): value is PureFC<AnyObject>;
    theme<TTheme extends Theme>(value: TTheme | unknown): value is TTheme;
    theme(value: unknown): value is Theme;
  }
}

is.reactElement = isValidElement;
is.reactComponent = (value): value is Component => value instanceof Component;
is.theme = (value: unknown): value is Theme => is.plainObject<Theme>(value) && is.not.empty(value.id) && is.plainObject(value.definition) && is.function(value.createVariant);
is.pureFC = (value: unknown): value is PureFC<AnyObject> => is.reactComponent(value) && is.function(value);
is.pureFCWithTheme = (value: unknown): value is PureFC<AnyObject> => is.pureFC(value) && is.theme(value.theme);