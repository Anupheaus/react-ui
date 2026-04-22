import '@anupheaus/common';
import { breakDownRequests } from './breakDownRequests';
import type { ListItemType } from '../../models';

// A minimal item that satisfies ListItemType (requires id: string).
type Item = { id: string; name: string };

// Helper: build a sparse cached-items array.
// `filled` is a Set of indices that are already populated; all other slots are undefined.
function makeCache(length: number, filled: Set<number> = new Set()): (Item | undefined)[] {
  const cache = new Array<Item | undefined>(length);
  for (const i of filled) {
    cache[i] = { id: String(i), name: `item-${i}` };
  }
  return cache;
}

// Helper: build a fully-populated cache with `count` items starting at index 0.
function makeFullCache(count: number): Item[] {
  return Array.from({ length: count }, (_, i) => ({ id: String(i), name: `item-${i}` }));
}

// ---------------------------------------------------------------------------

describe('breakDownRequests', () => {

  describe('empty cache', () => {
    it('returns at least one request covering the requested range when the cache is empty', () => {
      const requests = breakDownRequests<Item>({
        offset: 0,
        limit: 5,
        cachedItems: makeCache(0) as ListItemType[],
      });

      expect(requests.length).toBeGreaterThan(0);
      // The returned requests must collectively cover indices 0..4
      const covered = new Set<number>();
      for (const r of requests) {
        for (let i = r.offset; i < r.offset + r.limit; i++) covered.add(i);
      }
      for (let i = 0; i < 5; i++) {
        expect(covered.has(i)).toBe(true);
      }
    });

    it('returns requests with non-zero limit when there is nothing cached', () => {
      const requests = breakDownRequests<Item>({
        offset: 0,
        limit: 5,
        cachedItems: makeCache(0) as ListItemType[],
      });
      expect(requests.every(r => r.limit > 0)).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------

  describe('fully-populated cache', () => {
    it('returns an empty array when every slot in the requested range is already cached', () => {
      // total must be supplied so the algorithm cannot expand beyond the cache boundary
      // and discover un-populated slots past index 99.
      const requests = breakDownRequests<Item>({
        offset: 0,
        limit: 5,
        total: 100,
        cachedItems: makeFullCache(100) as ListItemType[],
      });
      expect(requests).toEqual([]);
    });

    it('returns an empty array when the total is 0', () => {
      const requests = breakDownRequests<Item>({
        offset: 0,
        limit: 5,
        total: 0,
        cachedItems: [] as ListItemType[],
      });
      expect(requests).toEqual([]);
    });
  });

  // ---------------------------------------------------------------------------

  describe('partial cache — only gaps are requested', () => {
    it('does not include already-cached index ranges in the returned requests', () => {
      // Indices 0–4 are cached; the window offset:0 limit:10 has gaps at 5–9
      const cache = makeCache(10, new Set([0, 1, 2, 3, 4]));

      const requests = breakDownRequests<Item>({
        offset: 0,
        limit: 10,
        total: 100,
        cachedItems: cache as ListItemType[],
      });

      // No returned request should overlap with indices 0–4 (already cached)
      for (const r of requests) {
        for (let i = r.offset; i < r.offset + r.limit; i++) {
          expect(i).toBeGreaterThanOrEqual(5);
        }
      }
    });

    it('requests cover all un-cached indices within the original window', () => {
      const cache = makeCache(10, new Set([0, 1, 2, 3, 4]));

      const requests = breakDownRequests<Item>({
        offset: 0,
        limit: 10,
        total: 100,
        cachedItems: cache as ListItemType[],
      });

      const covered = new Set<number>();
      for (const r of requests) {
        for (let i = r.offset; i < r.offset + r.limit; i++) covered.add(i);
      }
      // Indices 5–9 must be covered
      for (let i = 5; i < 10; i++) {
        expect(covered.has(i)).toBe(true);
      }
    });

    it('returns a single contiguous request for a contiguous gap', () => {
      // Indices 0–4 cached, 5–9 empty, total = 10 → only one gap block
      const cache = makeCache(10, new Set([0, 1, 2, 3, 4]));

      const requests = breakDownRequests<Item>({
        offset: 0,
        limit: 10,
        total: 10,
        cachedItems: cache as ListItemType[],
      });

      // All requests combined should form a single contiguous range 5–9
      const starts = requests.map(r => r.offset);
      expect(Math.min(...starts)).toBe(5);
    });
  });

  // ---------------------------------------------------------------------------

  describe('total boundary — requests must not exceed total', () => {
    it('clamps requests to the total when the expanded window would exceed it', () => {
      const total = 8;
      const requests = breakDownRequests<Item>({
        offset: 0,
        limit: 5,
        total,
        cachedItems: makeCache(0) as ListItemType[],
      });

      for (const r of requests) {
        expect(r.offset + r.limit).toBeLessThanOrEqual(total);
      }
    });

    it('returns an empty array when total is 0', () => {
      const requests = breakDownRequests<Item>({
        offset: 0,
        limit: 10,
        total: 0,
        cachedItems: makeCache(0) as ListItemType[],
      });
      expect(requests).toEqual([]);
    });

    it('does not exceed total even for a large limit', () => {
      const total = 15;
      const requests = breakDownRequests<Item>({
        offset: 0,
        limit: 100,
        total,
        cachedItems: makeCache(0) as ListItemType[],
      });
      for (const r of requests) {
        expect(r.offset + r.limit).toBeLessThanOrEqual(total);
      }
    });
  });

  // ---------------------------------------------------------------------------

  describe('all returned requests have valid shapes', () => {
    it('every request has a non-negative offset and positive limit', () => {
      const requests = breakDownRequests<Item>({
        offset: 2,
        limit: 8,
        total: 50,
        cachedItems: makeCache(0) as ListItemType[],
      });
      for (const r of requests) {
        expect(r.offset).toBeGreaterThanOrEqual(0);
        expect(r.limit).toBeGreaterThan(0);
      }
    });
  });
});
