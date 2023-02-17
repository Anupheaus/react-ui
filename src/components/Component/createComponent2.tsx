import '../../extensions/is';
import { Error, is } from '@anupheaus/common';
import { forwardRef, FunctionComponent, isValidElement, memo, Ref } from 'react';
import { internalThemes } from '../../theme/internalThemes';

interface Config<TFunc extends (props: any) => JSX.Element | null> {
  disableMemoisation?: boolean;
  onCompareProps?(prevProps: Parameters<TFunc>[0], newProps: Parameters<TFunc>[0]): boolean;
  onError?(error: Error, props: Parameters<TFunc>[0]): JSX.Element | null;
}

function defaultCompareProps(prevProps: any, newProps: any): boolean {
  if (prevProps === newProps) return true;
  if (typeof (prevProps) !== typeof (newProps)) return false;
  if (['number', 'string', 'boolean'].includes(typeof (prevProps))) return prevProps === newProps;
  if (is.function(prevProps)) return is.function(newProps) ? prevProps.toString() === newProps.toString() : false;
  if (prevProps instanceof Date) return newProps instanceof Date ? prevProps.getTime() === newProps.getTime() : false;
  if (isValidElement(prevProps)) {
    if (prevProps.type !== newProps.type) return false;
    if (prevProps.key !== newProps.key) return false;
    return defaultCompareProps(prevProps.props, newProps.props);
  }
  if (is.plainObject(prevProps)) {
    if (Object.keys(prevProps).length !== Object.keys(newProps).length) return false;
    return Object.keys(prevProps).every(key => defaultCompareProps(prevProps[key], newProps[key]));
  }
  // eslint-disable-next-line no-console
  console.error('Unable to compare props', { prevProps, newProps });
  return false;
}

function setName(func: FunctionComponent<{}>, name: string) {
  Reflect.defineProperty(func, 'name', { value: name, writable: false, enumerable: true, configurable: true });
  func.displayName = name;
}

export function createComponent<TFunc extends (props: any) => JSX.Element | null>(name: string, render: TFunc, {
  disableMemoisation = true, onCompareProps = defaultCompareProps, onError }: Config<TFunc> = {}): TFunc {
  let componentFunc = forwardRef<any, any>((props: {}, providedRef: Ref<HTMLElement>) => {
    const ref = is.function(providedRef) || is.reactRef(providedRef) ? providedRef : undefined;
    const fullProps = { ...props, ref };
    try {
      internalThemes.styles.synchronousProps = fullProps;
      return render(fullProps);
    } catch (error) {
      if (onError != null) return onError(new Error({ error }), fullProps);
      throw error;
    }
  }) as unknown as TFunc;
  setName(componentFunc, name);
  if (!disableMemoisation) {
    setName(componentFunc, `${name} (forwardRef)`);
    componentFunc = memo(componentFunc, onCompareProps) as unknown as TFunc;
    setName(componentFunc, `${name} (memo)`);
  }
  return componentFunc as unknown as TFunc;
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