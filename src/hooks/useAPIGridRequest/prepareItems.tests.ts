import '@anupheaus/common';
import { DeferredPromise } from '@anupheaus/common';
import { prepareItems } from './prepareItems';
import type { ListItemType } from '../../models';

type Item = { id: string; name: string };

// ---------------------------------------------------------------------------

describe('prepareItems', () => {

  describe('empty array — fills requested range with deferred promises', () => {
    it('populates all null slots in the range with non-null values', () => {
      const items: (DeferredPromise<Item> | Item)[] = [];

      prepareItems<Item>(items, { offset: 0, limit: 3 });

      expect(items[0]).not.toBeNull();
      expect(items[0]).not.toBeUndefined();
      expect(items[1]).not.toBeNull();
      expect(items[1]).not.toBeUndefined();
      expect(items[2]).not.toBeNull();
      expect(items[2]).not.toBeUndefined();
    });

    it('fills slots with DeferredPromise instances', () => {
      const items: (DeferredPromise<Item> | Item)[] = [];

      prepareItems<Item>(items, { offset: 0, limit: 3 });

      expect(items[0]).toBeInstanceOf(DeferredPromise);
      expect(items[1]).toBeInstanceOf(DeferredPromise);
      expect(items[2]).toBeInstanceOf(DeferredPromise);
    });

    it('only writes within the requested range — slots outside the range remain untouched', () => {
      const items: (DeferredPromise<Item> | Item)[] = [];

      prepareItems<Item>(items, { offset: 2, limit: 2 });

      // Indices 0 and 1 are before the range and should be untouched
      expect(items[0]).toBeUndefined();
      expect(items[1]).toBeUndefined();
      // Indices 4+ are after the range
      expect(items[4]).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------

  describe('already-filled slots are left untouched', () => {
    it('does not overwrite a real item that already occupies a slot', () => {
      const existing: Item = { id: '1', name: 'Alice' };
      const items: (DeferredPromise<Item> | Item)[] = [existing, existing, existing];

      prepareItems<Item>(items, { offset: 0, limit: 3 });

      // The original item reference must still be there
      expect(items[0]).toBe(existing);
      expect(items[1]).toBe(existing);
      expect(items[2]).toBe(existing);
    });

    it('does not overwrite an existing DeferredPromise that already occupies a slot', () => {
      const existingDeferred = Promise.createDeferred<Item>();
      const items: (DeferredPromise<Item> | Item)[] = [existingDeferred];

      prepareItems<Item>(items, { offset: 0, limit: 1 });

      expect(items[0]).toBe(existingDeferred);
    });
  });

  // ---------------------------------------------------------------------------

  describe('mixed filled and empty slots', () => {
    it('fills only the empty slots and leaves the filled slot intact', () => {
      const existing: Item = { id: '1', name: 'Alice' };
      const items: (DeferredPromise<Item> | Item)[] = [existing, undefined as any, undefined as any];

      prepareItems<Item>(items, { offset: 0, limit: 3 });

      expect(items[0]).toBe(existing);
      expect(items[1]).toBeInstanceOf(DeferredPromise);
      expect(items[2]).toBeInstanceOf(DeferredPromise);
    });

    it('fills each empty slot with a distinct DeferredPromise instance', () => {
      const items: (DeferredPromise<Item> | Item)[] = [undefined as any, undefined as any];

      prepareItems<Item>(items, { offset: 0, limit: 2 });

      expect(items[0]).not.toBe(items[1]);
    });
  });

  // ---------------------------------------------------------------------------

  describe('zero limit — no changes to the array', () => {
    it('makes no modifications when limit is 0', () => {
      const items: (DeferredPromise<Item> | Item)[] = [];

      prepareItems<Item>(items, { offset: 0, limit: 0 });

      expect(items).toHaveLength(0);
    });

    it('does not touch existing items when limit is 0', () => {
      const existing: Item = { id: '1', name: 'Alice' };
      const items: (DeferredPromise<Item> | Item)[] = [existing];

      prepareItems<Item>(items, { offset: 0, limit: 0 });

      expect(items[0]).toBe(existing);
    });
  });

  // ---------------------------------------------------------------------------

  describe('non-zero offset', () => {
    it('fills slots starting from the given offset', () => {
      const items: (DeferredPromise<Item> | Item)[] = [];

      prepareItems<Item>(items, { offset: 5, limit: 2 });

      expect(items[5]).toBeInstanceOf(DeferredPromise);
      expect(items[6]).toBeInstanceOf(DeferredPromise);
    });
  });
});
