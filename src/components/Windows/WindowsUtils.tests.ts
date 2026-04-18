import '@anupheaus/common';
import { isSimpleArgs, createWindowIdFromArgs, windowsUtils } from './WindowsUtils';

describe('isSimpleArgs', () => {
  it('returns true for an empty array', () => {
    expect(isSimpleArgs([])).toBe(true);
  });

  it('returns true for primitives only', () => {
    expect(isSimpleArgs([1, 'hello', true, null, undefined])).toBe(true);
  });

  it('returns false when an object is present', () => {
    expect(isSimpleArgs([{}])).toBe(false);
  });

  it('returns false when an array is present', () => {
    expect(isSimpleArgs([[]])).toBe(false);
  });
});

describe('createWindowIdFromArgs', () => {
  it('returns just the definitionId when args is empty', () => {
    expect(createWindowIdFromArgs('my-window', [])).toBe('my-window');
  });

  it('returns a stable hash string for the same args', () => {
    const a = createWindowIdFromArgs('win', ['hello', 42]);
    const b = createWindowIdFromArgs('win', ['hello', 42]);
    expect(a).toBe(b);
  });

  it('returns different ids for different args', () => {
    const a = createWindowIdFromArgs('win', ['a']);
    const b = createWindowIdFromArgs('win', ['b']);
    expect(a).not.toBe(b);
  });
});

describe('windowsUtils.reorderWindows', () => {
  it('reorders states to match previousOrder', () => {
    const states = [
      { id: 'a', title: 'A' },
      { id: 'b', title: 'B' },
    ] as any[];
    const [reordered] = windowsUtils.reorderWindows(states, ['b', 'a']);
    expect(reordered[0].id).toBe('b');
    expect(reordered[1].id).toBe('a');
  });

  it('appends states not in previousOrder at the end', () => {
    const states = [{ id: 'a', title: 'A' }, { id: 'c', title: 'C' }] as any[];
    const [reordered] = windowsUtils.reorderWindows(states, ['a']);
    expect(reordered[0].id).toBe('a');
    expect(reordered[1].id).toBe('c');
  });
});
