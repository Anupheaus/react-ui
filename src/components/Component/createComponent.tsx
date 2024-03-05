import '../../extensions/is';
import { Error, is, to } from '@anupheaus/common';
import { forwardRef, FunctionComponent, isValidElement, memo, NamedExoticComponent, ReactNode, Ref } from 'react';
import { createComponentOverrides } from './createComponentOverrides';

interface Config<TFunc extends (props: any) => JSX.Element | null> {
  disableMemoisation?: boolean;
  debug?: boolean;
  onCompareProps?(prevProps: Parameters<TFunc>[0], newProps: Parameters<TFunc>[0]): boolean;
  onError?(error: Error, props: Parameters<TFunc>[0]): JSX.Element | null;
}

function defaultCompareProps(debug: boolean, name: string) {
  const doCompare = (prevProps: any, newProps: any): boolean => {
    if (prevProps === newProps) return true;
    if (prevProps == null || newProps == null) return false;
    if (is.proxy(prevProps) || is.proxy(newProps)) {
      const actualPrevProps = is.proxy(prevProps) ? to.proxyApi(prevProps)?.value : prevProps;
      const actualNewProps = is.proxy(newProps) ? to.proxyApi(newProps)?.value : newProps;
      return defaultCompareProps(debug, name)(actualPrevProps, actualNewProps);
    }
    if (typeof (prevProps) !== typeof (newProps)) return false;
    if (['number', 'string', 'boolean'].includes(typeof (prevProps))) return prevProps === newProps;
    if (is.function(prevProps)) return is.function(newProps) ? prevProps.toString() === newProps.toString() : false;
    if (prevProps instanceof Date) return newProps instanceof Date ? prevProps.getTime() === newProps.getTime() : false;
    if (prevProps instanceof Array) {
      if (!(newProps instanceof Array) || prevProps.length !== newProps.length) return false;
      return prevProps.every((value, index) => defaultCompareProps(debug, name)(value, newProps[index]));
    }
    if (isValidElement(prevProps)) {
      if (prevProps.type !== newProps.type) return false;
      if (prevProps.key !== newProps.key) return false;
      return defaultCompareProps(debug, name)(prevProps.props, newProps.props);
    }
    if (is.plainObject(prevProps)) {
      if (Object.keys(prevProps).length !== Object.keys(newProps).length) return false;
      return Object.keys(prevProps).every(key => defaultCompareProps(debug, name)(prevProps[key], newProps[key]));
    }
    // eslint-disable-next-line no-console
    // console.warn('Assuming these props are not equal', { prevProps, newProps });
    return false;
  };
  if (debug) {
    return (prevProps: any, newProps: any) => {
      const result = doCompare(prevProps, newProps);
      // eslint-disable-next-line no-console
      console.log(`${name} - debug`, { prevProps, newProps, result });
      return result;
    };
  } else {
    return doCompare;
  }
}

function setName(func: FunctionComponent<{}>, name: string) {
  Reflect.defineProperty(func, 'name', { value: name, writable: false, enumerable: true, configurable: true });
  func.displayName = name;
}

export type ReactUIComponent<TFunc extends (props: any) => JSX.Element | null> = TFunc & {
  Overrides: NamedExoticComponent<Partial<Parameters<TFunc>[0]> & { children: ReactNode; }>;
};

export function createComponent<TFunc extends (props: any) => JSX.Element | null>(name: string, render: TFunc, {
  disableMemoisation = false, debug = false, onCompareProps = defaultCompareProps(debug, name), onError }: Config<TFunc> = {}): ReactUIComponent<TFunc> {

  const { Overrides, overrideProps } = createComponentOverrides();

  let componentFunc = forwardRef<any, any>((props: {}, providedRef: Ref<HTMLElement>) => {
    const ref = is.function(providedRef) || is.reactRef(providedRef) ? providedRef : undefined;
    const fullProps = overrideProps({ ...props, ref });
    try {
      return render(fullProps);
    } catch (error) {
      if (onError != null) return onError(new Error({ error }), fullProps);
      throw error;
    }
  }) as unknown as ReactUIComponent<TFunc>;
  setName(componentFunc, name);
  if (!disableMemoisation) {
    setName(componentFunc, `${name} (forwardRef)`);
    componentFunc = memo(componentFunc, onCompareProps) as unknown as ReactUIComponent<TFunc>;
    setName(componentFunc, `${name} (memo)`);
  }

  componentFunc.Overrides = Overrides;
  return componentFunc;
}

// interface MyComponentProps<T> {
//   records: T[];
//   onChange?(records: T[]): void;
// }

// const MyComponent = createComponent2(function render<T>(props: MyComponentProps<T>) {
//   return (<></>);
// });

// interface MyRecord {
//   id: number;
//   name: string;
// }

// const myRecords: MyRecord[] = [
//   { id: 1, name: 'one' },
// ];

// const handleOnChange = (record: MyRecord[]) => {
//   // do something
// };

// const result = (<>
//   <MyComponent records={myRecords} onChange={handleOnChange} />
// </>);