import { FunctionComponent } from 'react';

export function addDisplayName<F extends FunctionComponent>(component: F, name: string): F {
  component.displayName = name;
  return component;
}