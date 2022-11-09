import { ReactNode } from 'react';

export type AddChildren<TProps extends {}> = TProps extends { children: unknown; } ? TProps : TProps & { children?: ReactNode; };