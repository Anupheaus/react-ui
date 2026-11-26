import { getButtonLabel, isSingleSelect } from './SelectorButtonUtils';
import type { SelectorItem, SelectorSubItem } from './selector-models';

describe('getButtonLabel', () => {
  it('returns "Not Set" when no items are selected', () => {
    expect(getButtonLabel([])).toBe('Not Set');
  });

  it('returns the item label when one item is selected', () => {
    expect(getButtonLabel([{ id: '1', text: 'Foo', label: 'Bar' }])).toBe('Bar');
  });

  it('falls back to text when label is absent', () => {
    expect(getButtonLabel([{ id: '1', text: 'Foo' }])).toBe('Foo');
  });

  it('returns "N selected" when multiple items are selected', () => {
    expect(getButtonLabel([{ id: '1', text: 'A' }, { id: '2', text: 'B' }] satisfies SelectorSubItem[])).toBe('2 selected');
  });
});

describe('isSingleSelect', () => {
  it('returns true when config.totalSelectableItems is 1', () => {
    expect(isSingleSelect([], { totalSelectableItems: 1 })).toBe(true);
  });

  it('returns true when there is one item group with maxSelectableItems 1', () => {
    expect(isSingleSelect([{ id: 'g', text: 'G', subItems: [], maxSelectableItems: 1 } satisfies SelectorItem])).toBe(true);
  });

  it('returns false for multi-select config', () => {
    expect(isSingleSelect([{ id: 'g', text: 'G', subItems: [], maxSelectableItems: 3 } satisfies SelectorItem])).toBe(false);
  });
});
