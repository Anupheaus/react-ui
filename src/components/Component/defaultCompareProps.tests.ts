import { createElement } from 'react';
import { defaultCompareProps } from './defaultCompareProps';

function makeCompare({ name = 'TestComponent', whitelistFunctions = [] as PropertyKey[], topLevelProps = {} as unknown, debug = false } = {}) {
  const fn = defaultCompareProps({ debug, name, topLevelProps, whitelistFunctions });
  return (prev: unknown, next: unknown, propName: PropertyKey = 'props'): boolean => (fn as any)(prev, next, propName);
}

describe('defaultCompareProps', () => {

  describe('same-reference shortcut', () => {
    it('returns true for the same object reference without deep inspection', () => {
      const obj = { a: 1 };
      expect(makeCompare()(obj, obj)).toBe(true);
    });

    it('returns true for the same array reference', () => {
      const arr = [1, 2, 3];
      expect(makeCompare()(arr, arr)).toBe(true);
    });

    it('returns true for the same function reference', () => {
      const fn = () => { };
      expect(makeCompare()(fn, fn)).toBe(true);
    });

    it('returns true for the same Date reference', () => {
      const d = new Date();
      expect(makeCompare()(d, d)).toBe(true);
    });
  });

  describe('null and undefined', () => {
    it('returns true for null vs null', () => {
      expect(makeCompare()(null, null)).toBe(true);
    });

    it('returns true for undefined vs undefined', () => {
      expect(makeCompare()(undefined, undefined)).toBe(true);
    });

    it('returns false for null vs undefined', () => {
      expect(makeCompare()(null, undefined)).toBe(false);
    });

    it('returns false for null vs a value', () => {
      expect(makeCompare()(null, 'value')).toBe(false);
    });

    it('returns false for a value vs null', () => {
      expect(makeCompare()({}, null)).toBe(false);
    });
  });

  describe('primitives', () => {
    const equalPairs: [unknown, unknown][] = [
      ['hello', 'hello'],
      ['', ''],
      [42, 42],
      [0, 0],
      [true, true],
      [false, false],
    ];

    const unequalPairs: [unknown, unknown][] = [
      ['hello', 'world'],
      [1, 2],
      [true, false],
      ['1', 1],        // same value, different type
      [0, false],      // falsy but different type
    ];

    test.each(equalPairs)('returns true for equal primitive %p', (prev, next) => {
      expect(makeCompare()(prev, next)).toBe(true);
    });

    test.each(unequalPairs)('returns false for unequal or type-mismatched primitives %p vs %p', (prev, next) => {
      expect(makeCompare()(prev, next)).toBe(false);
    });
  });

  describe('functions', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
    });

    afterEach(() => {
      warnSpy.mockRestore();
    });

    it('returns true for the same function reference without warning', () => {
      const fn = () => { };
      expect(makeCompare()(fn, fn)).toBe(true);
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('returns false for different function references', () => {
      expect(makeCompare()(() => { }, () => { })).toBe(false);
    });

    it('warns when a function prop changes, naming the component and property', () => {
      makeCompare({ name: 'MyComp' })(() => { }, () => { }, 'onChange');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('"onChange"'),
        expect.anything(),
      );
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('"MyComp"'),
        expect.anything(),
      );
    });

    it('includes topLevelProps in the warning context', () => {
      const topLevelProps = { id: 'ctx' };
      makeCompare({ topLevelProps })(() => { }, () => { }, 'onClick');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ topLevelProps }),
      );
    });

    it('returns false and does not warn when the function is whitelisted', () => {
      const result = makeCompare({ whitelistFunctions: ['onChange'] })(() => { }, () => { }, 'onChange');
      expect(result).toBe(false);
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('warns for non-whitelisted functions but not for whitelisted ones in the same props', () => {
      const compare = makeCompare({ whitelistFunctions: ['onBlur'] });
      compare({ onChange: () => { }, onBlur: () => { } }, { onChange: () => { }, onBlur: () => { } });
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('"onChange"'), expect.anything());
    });

    it('returns false when prev is a function but next is not', () => {
      expect(makeCompare()(() => { }, 'notAFunction')).toBe(false);
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe('dates', () => {
    it('returns true for two Date instances with the same time value', () => {
      const time = 1_700_000_000_000;
      expect(makeCompare()(new Date(time), new Date(time))).toBe(true);
    });

    it('returns false for Date instances with different time values', () => {
      expect(makeCompare()(new Date(1000), new Date(2000))).toBe(false);
    });

    it('returns false for a Date vs a plain object', () => {
      expect(makeCompare()(new Date(), {})).toBe(false);
    });
  });

  describe('arrays', () => {
    it('returns true for two empty arrays', () => {
      expect(makeCompare()([], [])).toBe(true);
    });

    it('returns true for arrays with equal elements', () => {
      expect(makeCompare()([1, 'a', true], [1, 'a', true])).toBe(true);
    });

    it('returns false for arrays with different elements', () => {
      expect(makeCompare()([1, 2, 3], [1, 2, 4])).toBe(false);
    });

    it('returns false when arrays have different lengths', () => {
      expect(makeCompare()([1, 2], [1, 2, 3])).toBe(false);
    });

    it('returns false for an array vs a non-array', () => {
      expect(makeCompare()([1, 2], { 0: 1, 1: 2 })).toBe(false);
    });

    it('deeply compares nested arrays', () => {
      expect(makeCompare()([[1, 2], [3, 4]], [[1, 2], [3, 4]])).toBe(true);
      expect(makeCompare()([[1, 2], [3, 4]], [[1, 2], [3, 5]])).toBe(false);
    });
  });

  describe('React elements', () => {
    it('returns true for elements with the same type and no props', () => {
      expect(makeCompare()(createElement('div'), createElement('div'))).toBe(true);
    });

    it('returns false for elements with different types', () => {
      expect(makeCompare()(createElement('div'), createElement('span'))).toBe(false);
    });

    it('returns false for elements with different keys', () => {
      expect(makeCompare()(createElement('div', { key: 'a' }), createElement('div', { key: 'b' }))).toBe(false);
    });

    it('returns true for elements with equal primitive props', () => {
      expect(makeCompare()(
        createElement('div', { className: 'foo', tabIndex: 0 }),
        createElement('div', { className: 'foo', tabIndex: 0 }),
      )).toBe(true);
    });

    it('returns false for elements with different primitive props', () => {
      expect(makeCompare()(
        createElement('div', { className: 'foo' }),
        createElement('div', { className: 'bar' }),
      )).toBe(false);
    });
  });

  describe('function warning suppression inside React element children', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
    });

    afterEach(() => {
      warnSpy.mockRestore();
    });

    it('does not warn when a function prop inside a child element changes', () => {
      const prev = createElement('button', { onClick: () => { } });
      const next = createElement('button', { onClick: () => { } });
      makeCompare()(prev, next);
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('returns false when a function prop inside a child element changes', () => {
      const prev = createElement('button', { onClick: () => { } });
      const next = createElement('button', { onClick: () => { } });
      expect(makeCompare()(prev, next)).toBe(false);
    });

    it('warns for a top-level function change but not for the same change nested in a React element', () => {
      makeCompare()({ onChange: () => { } }, { onChange: () => { } });
      expect(warnSpy).toHaveBeenCalledTimes(1);
      warnSpy.mockClear();

      const prev = createElement('div', { onClick: () => { } });
      const next = createElement('div', { onClick: () => { } });
      makeCompare()(prev, next);
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe('plain objects', () => {
    it('returns true for two empty objects', () => {
      expect(makeCompare()({}, {})).toBe(true);
    });

    it('returns true for objects with equal primitive values', () => {
      expect(makeCompare()({ a: 1, b: 'hello', c: true }, { a: 1, b: 'hello', c: true })).toBe(true);
    });

    it('returns false for objects with different values', () => {
      expect(makeCompare()({ a: 1 }, { a: 2 })).toBe(false);
    });

    it('returns false when the prev object has more keys', () => {
      expect(makeCompare()({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    });

    it('returns false when the next object has more keys', () => {
      expect(makeCompare()({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it('deeply compares nested objects', () => {
      expect(makeCompare()({ outer: { inner: 1 } }, { outer: { inner: 1 } })).toBe(true);
      expect(makeCompare()({ outer: { inner: 1 } }, { outer: { inner: 2 } })).toBe(false);
    });
  });

  describe('mixed nested structures', () => {
    it('deeply compares objects containing arrays', () => {
      expect(makeCompare()({ ids: [1, 2, 3] }, { ids: [1, 2, 3] })).toBe(true);
      expect(makeCompare()({ ids: [1, 2, 3] }, { ids: [1, 2, 4] })).toBe(false);
    });

    it('deeply compares arrays containing objects', () => {
      expect(makeCompare()([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(true);
      expect(makeCompare()([{ a: 1 }], [{ a: 2 }])).toBe(false);
    });

    it('returns false for opaque class instances even when fields match', () => {
      class Foo { constructor(public x: number) { } }
      expect(makeCompare()(new Foo(1), new Foo(1))).toBe(false);
    });
  });

  describe('debug mode', () => {
    let logSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      logSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
      logSpy.mockRestore();
    });

    it('logs the component name and true when props are equal', () => {
      const fn = defaultCompareProps({ debug: true, name: 'DebugComp', topLevelProps: {}, whitelistFunctions: [] }) as (prev: unknown, next: unknown) => boolean;
      fn({ a: 1 }, { a: 1 });
      expect(logSpy).toHaveBeenCalledWith('DebugComp - debug', expect.objectContaining({ result: true }));
    });

    it('logs the component name and false when props differ', () => {
      const fn = defaultCompareProps({ debug: true, name: 'DebugComp', topLevelProps: {}, whitelistFunctions: [] }) as (prev: unknown, next: unknown) => boolean;
      fn({ a: 1 }, { a: 2 });
      expect(logSpy).toHaveBeenCalledWith('DebugComp - debug', expect.objectContaining({ result: false }));
    });

    it('includes prev and next props in the log', () => {
      const fn = defaultCompareProps({ debug: true, name: 'DebugComp', topLevelProps: {}, whitelistFunctions: [] }) as (prev: unknown, next: unknown) => boolean;
      const prev = { x: 1 };
      const next = { x: 2 };
      fn(prev, next);
      expect(logSpy).toHaveBeenCalledWith(
        'DebugComp - debug',
        expect.objectContaining({ prevProps: prev, newProps: next }),
      );
    });
  });

});
