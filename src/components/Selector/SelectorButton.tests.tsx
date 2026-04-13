import { getButtonLabel, isSingleSelect } from './SelectorButtonUtils';
import type { SelectorItem } from './selector-models';

describe('getButtonLabel', () => {
  it('returns "Not Set" when no items are selected', () => {
    expect(getButtonLabel([])).toBe('Not Set');
  });

  it('returns the item text when one item is selected', () => {
    expect(getButtonLabel([{ id: '1', text: 'Window' }])).toBe('Window');
  });

  it('prefers label over text when one item is selected and label is a string', () => {
    expect(getButtonLabel([{ id: '1', text: 'Window', label: 'A Window' }])).toBe('A Window');
  });

  it('returns "2 selected" when two items are selected', () => {
    expect(getButtonLabel([{ id: '1', text: 'A' }, { id: '2', text: 'B' }])).toBe('2 selected');
  });

  it('returns "n selected" for any count greater than 1', () => {
    expect(getButtonLabel([
      { id: '1', text: 'A' },
      { id: '2', text: 'B' },
      { id: '3', text: 'C' },
    ])).toBe('3 selected');
  });
});

describe('isSingleSelect', () => {
  it('returns true when totalSelectableItems is 1', () => {
    expect(isSingleSelect([], { totalSelectableItems: 1 })).toBe(true);
  });

  it('returns false when totalSelectableItems is greater than 1', () => {
    expect(isSingleSelect([], { totalSelectableItems: 2 })).toBe(false);
  });

  it('returns true when there is exactly one section with maxSelectableItems of 1', () => {
    const items: SelectorItem[] = [
      { id: '1', text: 'Category', maxSelectableItems: 1, subItems: [] },
    ];
    expect(isSingleSelect(items)).toBe(true);
  });

  it('returns false when there are multiple sections even if one has maxSelectableItems of 1', () => {
    const items: SelectorItem[] = [
      { id: '1', text: 'Category A', maxSelectableItems: 1, subItems: [] },
      { id: '2', text: 'Category B', subItems: [] },
    ];
    expect(isSingleSelect(items)).toBe(false);
  });

  it('returns false when one section has no maxSelectableItems restriction', () => {
    const items: SelectorItem[] = [
      { id: '1', text: 'Category', subItems: [] },
    ];
    expect(isSingleSelect(items)).toBe(false);
  });

  it('returns false when no config and multiple sections', () => {
    const items: SelectorItem[] = [
      { id: '1', text: 'A', subItems: [] },
      { id: '2', text: 'B', subItems: [] },
    ];
    expect(isSingleSelect(items)).toBe(false);
  });
});
