import * as React from 'react';
import { ConstructorOf } from 'anux-common';

declare module 'react' {

  // tslint:disable-next-line:interface-name
  interface ReactChildren {

    filterByType<C extends ConstructorOf<React.Component<any, any>>>(children: React.ReactNode, component: C)
      // @ts-ignore
      : React.ReactElement<C['prototype']['props']>[];
    filterByType<C extends ConstructorOf<React.Component<any, any>>>(children: React.ReactNode, component: C, deepFilter: boolean)
      // @ts-ignore
      : React.ReactElement<C['prototype']['props']>[];

  }

}

React.Children.filterByType = (children: React.ReactNode, component: ConstructorOf<React.Component>, deepFilter: boolean = false): React.ReactElement<any>[] => {
  if (!children) { return []; }
  const results: React.ReactElement<any>[] = [];
  React.Children.toArray(children).forEach((child: any) => {
    if (React.isValidElement(child)) {
      if (child.type === component) { results.push(child); }
      if (!deepFilter) { return; }
      const innerChildren: React.ReactNode = child.props['children'];
      results.push(...React.Children.filterByType(innerChildren, component, deepFilter));
    }
  });
  return results;
};
