import { ReactNode } from 'react';
import type { PureFC } from '../anuxComponents';
import { Theme } from '../theme';

export type PropsOf<C extends PureFC<any, HTMLElement, Theme>> = C extends PureFC<infer P, HTMLElement, Theme> ? P : never;
export type AddChildren<TProps extends {}> = TProps extends { children: unknown; } ? TProps : TProps & { children?: ReactNode; };