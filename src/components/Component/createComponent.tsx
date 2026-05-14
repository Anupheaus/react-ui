import '../../extensions/is';
import { Error, is } from '@anupheaus/common';
import type { FunctionComponent, NamedExoticComponent, ReactNode, Ref } from 'react';
import { forwardRef, memo } from 'react';
import { createComponentOverrides } from './createComponentOverrides';
import { defaultCompareProps } from './defaultCompareProps';

interface Config<TFunc extends (props: any) => JSX.Element | null> {
  disableMemoisation?: boolean;
  debug?: boolean;
  whitelistFunctions?: PropertyKey[];
  onCompareProps?(prevProps: Parameters<TFunc>[0], newProps: Parameters<TFunc>[0], key: PropertyKey, whitelistFunctions?: PropertyKey[]): boolean;
  onError?(error: Error, props: Parameters<TFunc>[0]): JSX.Element | null;
}

function setName(func: FunctionComponent<{}>, name: string) {
  Reflect.defineProperty(func, 'name', { value: name, writable: false, enumerable: true, configurable: true });
  func.displayName = name;
}

export type ReactUIComponent<TFunc extends (props: any) => JSX.Element | null = (() => JSX.Element | null)> = TFunc & {
  Overrides: NamedExoticComponent<Partial<Parameters<TFunc>[0]> & { children: ReactNode; }>;
};

export function createComponent<TFunc extends (props: any) => JSX.Element | null>(name: string, render: TFunc, {
  disableMemoisation = false, debug = false, whitelistFunctions, onCompareProps, onError }: Config<TFunc> = {}): ReactUIComponent<TFunc> {
  const { Overrides, overrideProps } = createComponentOverrides();
  const compareProps = (prevProps: any, newProps: any): boolean => {
    const allWhitelistFunctions = (whitelistFunctions ?? []).concat(newProps['data-whitelist-functions'] ?? []).distinct();
    if (onCompareProps != null) return onCompareProps(prevProps, newProps, 'props', allWhitelistFunctions);
    return defaultCompareProps({ debug, name, topLevelProps: newProps, whitelistFunctions: allWhitelistFunctions })(prevProps, newProps, 'props');
  };

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
    componentFunc = memo(componentFunc, compareProps) as unknown as ReactUIComponent<TFunc>;
    setName(componentFunc, `${name} (memo)`);
  }

  componentFunc.Overrides = Overrides;
  return componentFunc;
}
