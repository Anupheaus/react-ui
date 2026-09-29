import type { ReactNode } from 'react';
import { useState } from 'react';
import type { DialogDefinitionUtils } from '../Dialog/createDialog';
import { createDialog } from '../Dialog/createDialog';
import { Button } from '../Button';
import { useBound } from '../../hooks';

/**
 * Filtering a List or Table with fields the List/Table shows in its own dialog. The fields work on a draft copy of
 * `value`: Apply hands the draft to `onChange`, Clear hands `defaultValue` to `onChange`, and Cancel (or the close
 * button) changes nothing.
 */
export interface ListFilter<FilterType = unknown> {
  /** The filters applied now. */
  value: FilterType;
  /** What Clear goes back to — the list unfiltered, or its normal view. */
  defaultValue: FilterType;
  /** Called with the new filters when Apply or Clear is pressed. */
  onChange(value: FilterType): void;
  /** The dialog's fields, editing the draft. */
  renderFields(draft: FilterType, setDraft: (draft: FilterType) => void): ReactNode;
  /** How many filters are active — the number on the Filter button's badge. */
  countActive?(value: FilterType): number;
  /** The dialog's title; "Filter" when absent. */
  title?: ReactNode;
  /**
   * A hook giving the dialog's header props — how an app styles its dialogs' headers (its area colour, an icon). Called
   * inside the dialog.
   */
  useHeader?(): object;
}

const useNoHeader = (): object => ({});

/** The dialog the footer's Filter button opens for a {@link ListFilter}: the fields, then Clear, Cancel and Apply. */
export const ListFilterDialog = createDialog('ListFilterDialog', ({ Dialog, Header, Content, Actions, close }: DialogDefinitionUtils<void>) =>
  (filter: ListFilter) => {
    const [draft, setDraft] = useState(filter.value);
    // The same hook for the dialog's whole life: the filter it was opened with never changes.
    const headerProps = (filter.useHeader ?? useNoHeader)();

    const apply = useBound(() => { filter.onChange(draft); void close(); });
    const clear = useBound(() => { filter.onChange(filter.defaultValue); void close(); });
    const cancel = useBound(() => { void close(); });

    return (
      <Dialog title={filter.title ?? 'Filter'} minWidth={360}>
        {filter.useHeader != null && <Header {...headerProps} />}
        <Content isVertical gap="fields">
          {filter.renderFields(draft, setDraft)}
        </Content>
        <Actions onSave={apply} onCancel={cancel} saveLabel="Apply">
          <Button onSelect={clear} testId="list-filter-clear">Clear</Button>
        </Actions>
      </Dialog>
    );
  });
