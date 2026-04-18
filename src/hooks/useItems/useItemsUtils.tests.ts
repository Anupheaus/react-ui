import { ensureSelectedItemsPersist, updateWithResponse, updateStateWithSkeletons, clearResponse } from './useItemsUtils';
import type { ReactListItem } from '../../models';

type Item = { name: string };

function makeState(items: ReactListItem<Item>[] = [], extra = {}): any {
  return { items, total: items.length, isLoading: false, offset: 0, limit: 20, ...extra };
}

describe('ensureSelectedItemsPersist', () => {
  it('marks items as selected if their id is in selectedItemIds', () => {
    const items: ReactListItem<Item>[] = [{ id: '1', text: 'A', data: { name: 'A' } }];
    ensureSelectedItemsPersist(items, ['1']);
    expect(items[0].isSelected).toBe(true);
  });

  it('does not mark items when selectedItemIds is undefined', () => {
    const items: ReactListItem<Item>[] = [{ id: '1', text: 'A', data: { name: 'A' } }];
    ensureSelectedItemsPersist(items, undefined);
    expect(items[0].isSelected).toBeUndefined();
  });

  it('does not mark items where isSelectable is false', () => {
    const items: ReactListItem<Item>[] = [{ id: '1', text: 'A', data: { name: 'A' }, isSelectable: false }];
    ensureSelectedItemsPersist(items, ['1']);
    expect(items[0].isSelected).toBeUndefined();
  });
});

describe('updateWithResponse', () => {
  it('replaces items in the paginated range with response items', () => {
    const state = makeState([]);
    const response: ReactListItem<Item>[] = [{ id: '1', text: 'A', data: { name: 'A' } }];
    const next = updateWithResponse(state, { offset: 0, limit: 1 }, response, 1);
    expect(next.items[0].id).toBe('1');
    expect(next.isLoading).toBe(false);
  });

  it('sets total from the response', () => {
    const state = makeState([]);
    const next = updateWithResponse(state, { offset: 0, limit: 1 }, [], 42);
    expect(next.total).toBe(42);
  });
});

describe('updateStateWithSkeletons', () => {
  it('fills empty slots with skeleton items', () => {
    const state = makeState([]);
    const next = updateStateWithSkeletons(state, { offset: 0, limit: 3 });
    expect(next.items).toHaveLength(3);
    expect(next.items[0]._tempItem).toBe(true);
    expect(next.isLoading).toBe(true);
  });

  it('does not replace existing items', () => {
    const existing: ReactListItem<Item>[] = [{ id: 'x', text: 'X', data: { name: 'X' } }];
    const state = makeState(existing);
    const next = updateStateWithSkeletons(state, { offset: 0, limit: 2 });
    expect(next.items[0].id).toBe('x');
    expect(next.items[1]._tempItem).toBe(true);
  });
});

describe('clearResponse', () => {
  it('resets items to empty array and total to 0', () => {
    const items: ReactListItem<Item>[] = [{ id: '1', text: 'A', data: { name: 'A' } }];
    const state = makeState(items, { total: 1 });
    const next = clearResponse(state);
    expect(next.items).toHaveLength(0);
    expect(next.total).toBe(0);
    expect(next.isLoading).toBe(false);
  });
});
