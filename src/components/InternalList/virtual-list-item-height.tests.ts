import { describe, expect, it } from 'vitest';
import { measureVirtualListItemHeight, resolveVirtualListItemHeight } from './virtual-list-item-height';

/** A scroller whose rows have the given heights (jsdom has no layout, so each row reports its height directly). */
function createScroller(rowHeights: number[]): HTMLDivElement {
  const container = document.createElement('div');
  const content = document.createElement('scroller-content');
  rowHeights.forEach(rowHeight => {
    const row = document.createElement('list-item');
    row.getBoundingClientRect = () => ({ height: rowHeight } as DOMRect);
    content.appendChild(row);
  });
  container.appendChild(content);
  return container;
}

describe('measureVirtualListItemHeight', () => {
  it('is the average of every rendered row, not the first row alone', () => {
    // A history list whose lines wrap: 43px for two lines, 31px for one. The first row must not decide the height.
    expect(measureVirtualListItemHeight(createScroller([43, 31, 31, 43]))).toBe(37);
  });

  it('is the same whichever row the window starts on', () => {
    const startsTall = measureVirtualListItemHeight(createScroller([43, 31, 31, 31]));
    const startsShort = measureVirtualListItemHeight(createScroller([31, 31, 31, 43]));
    expect(startsTall).toBe(startsShort);
  });

  it('is undefined with no rows or no content', () => {
    expect(measureVirtualListItemHeight(createScroller([]))).toBeUndefined();
    expect(measureVirtualListItemHeight(document.createElement('div'))).toBeUndefined();
  });

  it('is undefined while rows have no height yet', () => {
    expect(measureVirtualListItemHeight(createScroller([0, 0]))).toBeUndefined();
  });
});

describe('resolveVirtualListItemHeight', () => {
  it('adopts the first real height at once', () => {
    expect(resolveVirtualListItemHeight({ measuredHeight: 40, currentHeight: 18, changeCount: 0 })).toBe(40);
  });

  it('keeps the current height when the measure differs by a few percent (a window of taller or shorter rows)', () => {
    expect(resolveVirtualListItemHeight({ measuredHeight: 38, currentHeight: 36, changeCount: 1 })).toBe(36);
    expect(resolveVirtualListItemHeight({ measuredHeight: 34, currentHeight: 36, changeCount: 1 })).toBe(36);
  });

  it('replaces the fallback guess with a real height that is only a little taller (19px rows are not kept at 18px)', () => {
    expect(resolveVirtualListItemHeight({ measuredHeight: 19, currentHeight: 18, changeCount: 0 })).toBe(19);
    expect(resolveVirtualListItemHeight({ measuredHeight: 20, currentHeight: 18, changeCount: 0 })).toBe(20);
  });

  it('adopts a clearly different height (loading rows replaced by real rows)', () => {
    expect(resolveVirtualListItemHeight({ measuredHeight: 60, currentHeight: 36, changeCount: 1 })).toBe(60);
  });

  it('stops changing after a few changes in a row, so two heights can never flip forever', () => {
    // Expected outcome written independently: whatever the sequence of measures, the height settles.
    let currentHeight = 18;
    let changeCount = 0;
    const measures = Array.from({ length: 200 }, (_, index) => (index % 2 === 0 ? 70 : 30));
    measures.forEach(measuredHeight => {
      const next = resolveVirtualListItemHeight({ measuredHeight, currentHeight, changeCount });
      if (next !== currentHeight) changeCount += 1;
      currentHeight = next;
    });
    expect(changeCount).toBeLessThanOrEqual(3);
  });
});
