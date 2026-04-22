import '@anupheaus/common';
import { DeferredPromise } from '@anupheaus/common';
import { saveItems } from './saveItems';
import type { ListItemType } from '../../models';

type Item = { id: string; name: string };

// ---------------------------------------------------------------------------

describe('saveItems', () => {

  describe('saves items into empty cache slots', () => {
    it('writes each item into the corresponding index', () => {
      const cached: (DeferredPromise<Item> | Item)[] = [];
      const items: Item[] = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
        { id: '3', name: 'Carol' },
      ];

      saveItems<Item>(cached, items, { offset: 0, limit: 3 });

      expect(cached[0]).toEqual({ id: '1', name: 'Alice' });
      expect(cached[1]).toEqual({ id: '2', name: 'Bob' });
      expect(cached[2]).toEqual({ id: '3', name: 'Carol' });
    });

    it('stores exactly the item objects returned (same reference)', () => {
      const cached: (DeferredPromise<Item> | Item)[] = [];
      const alice: Item = { id: '1', name: 'Alice' };

      saveItems<Item>(cached, [alice], { offset: 0, limit: 1 });

      expect(cached[0]).toBe(alice);
    });
  });

  // ---------------------------------------------------------------------------

  describe('resolves DeferredPromise slots', () => {
    it('resolves the deferred promise with the new item', async () => {
      const deferred = Promise.createDeferred<Item>();
      const cached: (DeferredPromise<Item> | Item)[] = [deferred];
      const alice: Item = { id: '1', name: 'Alice' };

      saveItems<Item>(cached, [alice], { offset: 0, limit: 1 });

      await expect(deferred).resolves.toEqual({ id: '1', name: 'Alice' });
    });

    it('replaces the deferred promise slot with the real item after saving', () => {
      const deferred = Promise.createDeferred<Item>();
      const cached: (DeferredPromise<Item> | Item)[] = [deferred];
      const alice: Item = { id: '1', name: 'Alice' };

      saveItems<Item>(cached, [alice], { offset: 0, limit: 1 });

      expect(cached[0]).toBe(alice);
    });

    it('resolves each deferred in a multi-item save', async () => {
      const d1 = Promise.createDeferred<Item>();
      const d2 = Promise.createDeferred<Item>();
      const cached: (DeferredPromise<Item> | Item)[] = [d1, d2];
      const items: Item[] = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ];

      saveItems<Item>(cached, items, { offset: 0, limit: 2 });

      await expect(d1).resolves.toEqual({ id: '1', name: 'Alice' });
      await expect(d2).resolves.toEqual({ id: '2', name: 'Bob' });
    });
  });

  // ---------------------------------------------------------------------------

  describe('overwrites an existing item with the new one', () => {
    it('replaces a previously cached real item', () => {
      const old: Item = { id: '1', name: 'Old' };
      const cached: (DeferredPromise<Item> | Item)[] = [old];
      const updated: Item = { id: '1', name: 'Updated' };

      saveItems<Item>(cached, [updated], { offset: 0, limit: 1 });

      expect(cached[0]).toEqual({ id: '1', name: 'Updated' });
      expect(cached[0]).toBe(updated);
    });
  });

  // ---------------------------------------------------------------------------

  describe('stops early when items.length is less than limit', () => {
    it('does not write past the end of the items array', () => {
      const cached: (DeferredPromise<Item> | Item)[] = [];
      const items: Item[] = [{ id: '1', name: 'Alice' }];

      // limit says 3 but only 1 item was returned
      saveItems<Item>(cached, items, { offset: 0, limit: 3 });

      expect(cached[0]).toEqual({ id: '1', name: 'Alice' });
      expect(cached[1]).toBeUndefined();
      expect(cached[2]).toBeUndefined();
    });

    it('writes nothing when items array is empty', () => {
      const original: Item = { id: '9', name: 'Existing' };
      const cached: (DeferredPromise<Item> | Item)[] = [original];

      saveItems<Item>(cached, [], { offset: 0, limit: 3 });

      expect(cached[0]).toBe(original);
    });
  });

  // ---------------------------------------------------------------------------

  describe('correct offset handling', () => {
    it('writes items starting at the given offset, not at index 0', () => {
      const cached: (DeferredPromise<Item> | Item)[] = [];
      const items: Item[] = [
        { id: '5', name: 'Five' },
        { id: '6', name: 'Six' },
        { id: '7', name: 'Seven' },
      ];

      saveItems<Item>(cached, items, { offset: 5, limit: 3 });

      // Indices before offset must remain untouched
      expect(cached[0]).toBeUndefined();
      expect(cached[4]).toBeUndefined();
      // Items written at the correct positions
      expect(cached[5]).toEqual({ id: '5', name: 'Five' });
      expect(cached[6]).toEqual({ id: '6', name: 'Six' });
      expect(cached[7]).toEqual({ id: '7', name: 'Seven' });
    });

    it('resolves a deferred promise at an offset position correctly', async () => {
      const deferred = Promise.createDeferred<Item>();
      const cached: (DeferredPromise<Item> | Item)[] = [];
      cached[5] = deferred;
      const item: Item = { id: '5', name: 'Five' };

      saveItems<Item>(cached, [item], { offset: 5, limit: 1 });

      await expect(deferred).resolves.toEqual({ id: '5', name: 'Five' });
      expect(cached[5]).toBe(item);
    });

    it('maps items by their position in the items array, not by their id', () => {
      const cached: (DeferredPromise<Item> | Item)[] = [];
      // items[0] goes to cached[5], items[1] goes to cached[6]
      const items: Item[] = [
        { id: 'a', name: 'First' },
        { id: 'b', name: 'Second' },
      ];

      saveItems<Item>(cached, items, { offset: 5, limit: 2 });

      expect((cached[5] as Item).id).toBe('a');
      expect((cached[6] as Item).id).toBe('b');
    });
  });
});
