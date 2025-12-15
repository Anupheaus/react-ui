import type { ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import { createComponent } from '../Component';
import { useBound, useUpdatableState } from '../../hooks';
import { is } from '@anupheaus/common';

interface SelectableListContextProps {
  selectedItems: string[];
  setSelectedItems(id: string, isSelected: boolean): void;
}

const SelectableListContext = createContext<SelectableListContextProps>({
  selectedItems: [],
  setSelectedItems: () => void 0,
});

interface Props {
  value?: string | string[];
  multiSelect: boolean;
  children: ReactNode;
  onChange?(value: string | string[]): void;
}

export const SelectableListProvider = createComponent('SelectableListProvider', ({
  value,
  multiSelect,
  children,
  onChange,
}: Props) => {
  const [selectedItems, innerSetSelectedItems] = useUpdatableState<string[]>(() => value == null ? [] : (is.array(value) ? value : [value]), [value]);

  const setSelectedItems = useBound((id: string, isSelected: boolean) => {
    innerSetSelectedItems(currentSelectedItems => {
      if (isSelected) {
        const newSelectedItems = multiSelect ? [...currentSelectedItems, id] : [id];
        onChange?.(newSelectedItems);
        return newSelectedItems;
      } else {
        const newSelectedItems = currentSelectedItems.remove(id);
        if (newSelectedItems.length === currentSelectedItems.length) return currentSelectedItems;
        onChange?.(newSelectedItems);
        return newSelectedItems;
      }
    });
  });

  const context = useMemo<SelectableListContextProps>(() => ({
    selectedItems,
    setSelectedItems,
  }), [selectedItems, setSelectedItems]);

  return (
    <SelectableListContext.Provider value={context}>
      {children}
    </SelectableListContext.Provider>
  );
});

export function useSelectableList() {
  return useContext(SelectableListContext);
}
