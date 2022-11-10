import { ConstructorOf } from '@anupheaus/common';
import { Component } from 'react';

type ComponentType = ConstructorOf<Component<unknown, unknown>> & Function;
type PropsOf<T extends ComponentType> = React.ReactElement<T['prototype']['props']>[];

export function type<C extends ComponentType>(children: React.ReactNode, component: C): PropsOf<C>;
export function type<C extends ComponentType>(children: React.ReactNode, component: C, deepFilter: boolean): PropsOf<C>;
export function type<C extends ComponentType>(children: React.ReactNode, component: C, deepFilter = false): PropsOf<C> {
  const results: React.ReactElement<unknown>[] = [];
  React.Children.toArray(children).forEach(child => {
    if (React.isValidElement(child)) {
      if (child.type === component) { results.push(child); }
      if (!deepFilter) { return; }
      const innerChildren: React.ReactNode = child.props.children;
      results.push(...type(innerChildren, component, deepFilter));
    }
  });
  return results;
}
