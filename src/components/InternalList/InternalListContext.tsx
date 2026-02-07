import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';
import { createComponent } from '../Component';

interface InternalListContextProps<T = void> {
  onDelete?(id: string, item: T, index: number): void;
  onSelectChange(id: string, item: T, index: number, isSelected: boolean): void;
  onActiveChange(id: string, item: T, index: number, isActive: boolean): void;
}

const InternalListItemContext = createContext<InternalListContextProps<any>>({
  onSelectChange: () => void 0,
  onActiveChange: () => void 0,
});

export const InternalListContextProvider = createComponent('InternalListContextProvider', function <T>({ children, ...props }: PropsWithChildren<InternalListContextProps<T>>) {
  return (
    <InternalListItemContext.Provider value={props}>
      {children}
    </InternalListItemContext.Provider>
  );
});

export function useInternalListContext<T = void>(): InternalListContextProps<T> {
  return useContext(InternalListItemContext);
}