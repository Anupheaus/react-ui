import { is } from 'anux-common';

import { isValidElement, Component, ReactElement } from 'react';
export { };

declare module 'anux-common' {
  export interface Is {
    reactElement(value: unknown): value is ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;
    reactComponent(value: unknown): value is Component;
  }
}

is.reactElement = isValidElement;
is.reactComponent = (value): value is Component => value instanceof Component;
