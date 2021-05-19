/* eslint-disable no-console */
import { AnyObject } from 'anux-common';
import { ForwardRefRenderFunction, forwardRef, PropsWithChildren, ReactElement, RefObject, FunctionComponent, RefAttributes, memo, useMemo } from 'react';
import { areDeepEqual } from '../areEqual';

export interface IAnuxRef<T> extends RefObject<T> {
  (instance: T | null): void;
}

type AddDefaultChildren<Props> = Props extends { children: infer C } ? Props : PropsWithChildren<Props>;

export interface IAnuxRefForwardingComponent<TProps extends {}, TRef>
  extends Omit<ForwardRefRenderFunction<TRef, TProps>,
  '(props: PropsWithChildren<P>, ref: ((instance: T | null) => void) | MutableRefObject<T | null> | null): ReactElement | null'> {
  (props: AddDefaultChildren<TProps>, ref: IAnuxRef<TRef> | null): ReactElement | null;
}

export type AnuxFunctionComponent<Props = {}> = Omit<FunctionComponent<Props>, '(props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null'> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (props: AddDefaultChildren<Props>, context?: any): ReactElement<any, any> | null;
};

function anuxBaseFunctionComponent<TProps extends {} = {}, TRef = HTMLElement>(isPure: boolean, validateProps: ((props: TProps) => void) | null, name: string,
  component: IAnuxRefForwardingComponent<TProps, TRef>): AnuxFunctionComponent<TProps & RefAttributes<TRef>> {
  let result = forwardRef<TRef, TProps>((props, ref) => {
    if (validateProps) { validateProps(props); }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return component(props as any, ref as IAnuxRef<TRef>);
  });
  if (isPure) { result = memo(result) as unknown as typeof result; }
  result.displayName = name;
  return result as unknown as AnuxFunctionComponent<TProps & RefAttributes<TRef>>;
}

export function anuxFC<TProps extends {} = {}, TRef = HTMLElement>(name: string, component: IAnuxRefForwardingComponent<TProps, TRef>) {
  return anuxBaseFunctionComponent(false, null, name, component);
}

export function anuxPureFC<Props extends {} = {}, TRef = HTMLElement>(name: string, component: IAnuxRefForwardingComponent<Props, TRef>) {
  let lastProps: AnyObject;
  const validateProps = (props: Props) => {
    if (process.env.NODE_ENV !== 'development') { return; }
    if (areDeepEqual(lastProps, props)) {
      if (lastProps && 'children' in lastProps && props && 'children' in props && lastProps.children !== (props as AnyObject).children) {
        console.warn(`WARNING: the "children" property of "${name}" is causing an unnecessary render, recommend using useMemo or useBinder to prevent this.`);
      } else {
        const changedProps = Object.keys(props).filter(key => (props as AnyObject)[key] !== lastProps[key] && areDeepEqual((props as AnyObject)[key], lastProps[key]));
        if (changedProps.length > 0) {
          console.warn(`WARNING: Unnecessary render of "${name}" due to the following properties:`, changedProps);
        }
      }
    }
    lastProps = props;
  }
  return anuxBaseFunctionComponent(true, validateProps, name, component);
}

export function anuxGenericPureFC<PropsType extends {} = {}, RefType = HTMLElement>(name: string, props: PropsType, component: IAnuxRefForwardingComponent<PropsType, RefType>) {
  const Component = useMemo(() => anuxPureFC(name, component), []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Component {...(props as any)} />;

}