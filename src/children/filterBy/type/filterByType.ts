import * as React from 'react';
import { ConstructorOf } from 'anux-common';

type ComponentType = ConstructorOf<React.Component<any, any>> & Function;
type PropsOf<T extends ComponentType> = React.ReactElement<T['prototype']['props']>[];

export function type<C extends ComponentType>(children: React.ReactNode, component: C): PropsOf<C>;
export function type<C extends ComponentType>(children: React.ReactNode, component: C, deepFilter: boolean): PropsOf<C>;
export function type<C extends ComponentType>(children: React.ReactNode, component: C, deepFilter = false): PropsOf<C> {
  const results: React.ReactElement<any>[] = [];
  React.Children.toArray(children).forEach((child: any) => {
    if (React.isValidElement(child)) {
      if (child.type === component) { results.push(child); }
      if (!deepFilter) { return; }
      const innerChildren: React.ReactNode = child.props['children'];
      results.push(...type(innerChildren, component, deepFilter));
    }
  });
  return results;
}
