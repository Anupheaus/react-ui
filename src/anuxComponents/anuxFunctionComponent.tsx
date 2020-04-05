/* eslint-disable no-console */
import { RefForwardingComponent, forwardRef, PropsWithChildren, ReactElement, RefObject, FunctionComponent, RefAttributes, memo, useMemo } from 'react';
import { areDeepEqual } from '../areEqual';

export interface IAnuxRef<T> extends RefObject<T> {
  (instance: T | null): void;
}

export interface IAnuxRefForwardingComponent<TProps extends {}, TRef> extends Omit<RefForwardingComponent<TRef, TProps>, '(props: PropsWithChildren<P>, ref: Ref<T>)'> {
  (props: PropsWithChildren<TProps>, ref: IAnuxRef<TRef> | null): ReactElement | null;
}

function anuxBaseFunctionComponent<TProps extends {} = {}, TRef = HTMLElement>(isPure: boolean, validateProps: ((props: TProps) => void) | null, name: string,
  component: IAnuxRefForwardingComponent<TProps, TRef>) {
  let result = forwardRef<TRef, TProps>((props, ref) => {
    if (validateProps) { validateProps(props); }
    return component(props, ref as IAnuxRef<TRef>);
  });
  if (isPure) { result = memo(result) as unknown as typeof result; }
  result.displayName = name;
  return result as unknown as FunctionComponent<TProps & RefAttributes<TRef>>;
}

export function anuxFC<TProps extends {} = {}, TRef = HTMLElement>(name: string, component: IAnuxRefForwardingComponent<TProps, TRef>) {
  return anuxBaseFunctionComponent(false, null, name, component);
}

type AnyProps<Props extends {}> = PropsWithChildren<Props> & { [key: string]: unknown };

export function anuxPureFC<Props extends {} = {}, TRef = HTMLElement>(name: string, component: IAnuxRefForwardingComponent<Props, TRef>) {
  let lastProps: AnyProps<Props>;
  const validateProps = (props: AnyProps<Props>) => {
    if (process.env.NODE_ENV !== 'development') { return; }
    if (areDeepEqual(lastProps, props)) {
      if (lastProps && lastProps.children && props && props.children && lastProps['children'] !== props['children']) {
        console.warn(`WARNING: the "children" property of "${name}" is causing an unnecessary render, recommend using useMemo or useBinder to prevent this.`);
      } else {
        const changedProps = Object.keys(props).filter(key => props[key] !== lastProps[key] && areDeepEqual(props[key], lastProps[key]));
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Component = useMemo(() => anuxPureFC(name, component), []);
  return <Component {...props} />;

}