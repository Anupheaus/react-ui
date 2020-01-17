import 'anux-common';
import { isValidElement, Component } from 'react';
export { };

declare global {
  namespace Reflect {
    interface ITypeOf<T = object> {
      isReactElement: boolean;
      isReactComponent: boolean;
    }
  }
}

const originalTypeOf = Reflect.typeOf;

Reflect.typeOf = <T = object>(value: T): Reflect.ITypeOf<T> => {
  const result = originalTypeOf(value);

  const isReactElement = isValidElement(value);
  const isReactComponent = value instanceof Component;

  return {
    ...result,
    isReactComponent,
    isReactElement,
  };
};
