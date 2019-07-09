import { RefForwardingComponent, forwardRef } from 'react';

export function anuxFunctionComponent<TProps extends {}>(name: string, component: RefForwardingComponent<HTMLElement, TProps>) {
  component.displayName = name;
  return forwardRef(component);
}
