import * as React from 'react';
import { IMap, ConstructorOf } from '@anupheaus/common';

export function separate<M extends IMap<ConstructorOf<React.Component<any, any>> & Function>, K extends keyof M>(children: React.ReactNode, map: M):
  Record<K, React.ReactElement<M[K]['prototype']['props']>[]> & { others: React.ReactNode; } {
  const values = Object.values(map);
  const keys = Object.keys(map);
  const result: any = keys
    .concat('others')
    .reduce((obj, key) => ({
      ...obj,
      [key]: [],
    }), {});
  React.Children.toArray(children)
    .forEach((child: any) => {
      const index = child.type ? values.findIndex(value => Reflect.isOrDerivesFrom(child.type, value)) : -1;
      if (index >= 0) {
        result[keys[index]].push(child);
      } else {
        result.others.push(child);
      }
    });
  return result;
}
