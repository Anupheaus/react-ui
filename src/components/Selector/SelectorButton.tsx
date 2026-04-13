import { useRef, useState } from 'react';
import { Popover } from '@mui/material';
import { createComponent } from '../Component';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import { Button } from '../Button';
import type { SelectorItem, SelectorSubItem } from './selector-models';
import type { SelectorSelectionConfiguration } from './Selector';
import { InternalSelector } from './InternalSelector';
import { getButtonLabel, isSingleSelect } from './SelectorButtonUtils';
import { useBound, useUpdatableState } from '../../hooks';

interface Props extends FieldProps {
  items: SelectorItem[];
  selectionConfiguration?: SelectorSelectionConfiguration;
  onSelect?(selectedItems: SelectorSubItem[]): void;
}

export const SelectorButton = createComponent('SelectorButton', ({
  items,
  selectionConfiguration,
  onSelect,
  ...props
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [selectedItems, setSelectedItems] = useUpdatableState<SelectorSubItem[]>(
    () => items.mapMany(item => item.subItems.filter(si => si.isSelected === true)),
    [items],
  );

  const openPopover = useBound(() => setIsOpen(true));
  const closePopover = useBound(() => setIsOpen(false));

  const handleSelect = useBound((newSelectedItems: SelectorSubItem[]) => {
    setSelectedItems(newSelectedItems);
    onSelect?.(newSelectedItems);
    if (isSingleSelect(items, selectionConfiguration)) setIsOpen(false);
  });

  const label = getButtonLabel(selectedItems);

  return (
    <>
      <Field tagName="selector-button" {...props}>
        <Button ref={buttonRef} onClick={openPopover} align="left">
          {label}
        </Button>
      </Field>
      <Popover
        open={isOpen}
        anchorEl={buttonRef.current}
        onClose={closePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <InternalSelector items={items} selectionConfiguration={selectionConfiguration} onSelect={handleSelect} />
      </Popover>
    </>
  );
});
