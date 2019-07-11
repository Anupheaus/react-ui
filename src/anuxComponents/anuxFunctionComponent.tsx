import { RefForwardingComponent, forwardRef, PropsWithChildren, ReactElement, RefObject, FunctionComponent, RefAttributes } from 'react';

export interface IAnuxRef<T> extends RefObject<T> {
  (instance: T | null): void;
}

export interface IAnuxRefForwardingComponent<TProps extends {}, TRef> extends Omit<RefForwardingComponent<TRef, TProps>, '(props: PropsWithChildren<P>, ref: Ref<T>)'> {
  (props: PropsWithChildren<TProps>, ref: IAnuxRef<TRef>): ReactElement | null;
}

export function anuxFunctionComponent<TProps extends {} = {}, TRef = HTMLElement>(name: string, component: IAnuxRefForwardingComponent<TProps, TRef>): FunctionComponent<TProps & RefAttributes<TRef>> {
  const result = forwardRef<TRef, TProps>((props, ref) => component(props, ref as any));
  result.displayName = name;
  return result as any;
}
