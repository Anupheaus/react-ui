export { };

declare global {
  namespace Reflect {
    interface ITypeOf<T = any> {
      isReactElement: boolean;
      isReactComponent: boolean;
    }
  }
}

const originalTypeOf = Reflect.typeOf;

Reflect.typeOf = (value: any): Reflect.ITypeOf => {
  const result = originalTypeOf(value);

  const isReactElement = React.isValidElement(value);
  const isReactComponent = value instanceof React.Component;

  return {
    ...result,
    isReactComponent,
    isReactElement,
  };
};
