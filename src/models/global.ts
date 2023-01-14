import { ReactNode } from 'react';

export interface ListItem {
  id: string;
  text: string;
  label?: ReactNode;
  iconName?: string;
  tooltip?: ReactNode;
  isDisabled?: boolean;
  ordinal?: number;
}

export namespace ListItems {
  interface CreateListItems<T extends readonly ListItem[]> { ids: T[number]['id'], pairs: T; }

  export function create<T extends readonly ListItem[]>(pairs: T): CreateListItems<T>;
  export function create<T extends readonly ListItem[]>(pairs: T) {
    return {
      ids: pairs.map(pair => pair.id),
      pairs,
    };
  }

  export function as<B extends ListItem>(): { create<T extends readonly B[]>(items: T): CreateListItems<T>; } {
    return { create };
  }
}