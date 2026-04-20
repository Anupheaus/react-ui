import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { LocaleProvider } from './LocaleProvider';
import { useLocale } from './useLocale';
import { DateTime } from 'luxon';

const defaultSettings = {
  locale: 'en-GB',
  currency: 'GBP',
};

function wrapper({ children }: { children: ReactNode }) {
  return createElement(LocaleProvider, { settings: defaultSettings, children });
}

describe('useLocale — isValidISODate', () => {
  it('returns true for a valid ISO string', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.isValidISODate('2024-01-15T10:30:00Z')).toBe(true);
  });

  it('returns true for a Date object', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.isValidISODate(new Date())).toBe(true);
  });

  it('returns true for a DateTime object', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.isValidISODate(DateTime.now())).toBe(true);
  });

  it('returns false for undefined', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.isValidISODate(undefined)).toBe(false);
  });

  it('returns false for a non-ISO string', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.isValidISODate('hello')).toBe(false);
  });
});

describe('useLocale — toDate', () => {
  it('returns undefined for undefined input', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.toDate(undefined)).toBeUndefined();
  });

  it('converts an ISO string to a DateTime', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    const dt = result.current.toDate('2024-06-15T10:00:00Z');
    expect(DateTime.isDateTime(dt)).toBe(true);
    expect(dt?.year).toBe(2024);
  });

  it('converts a Date object to a DateTime', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    const dt = result.current.toDate(new Date(2024, 5, 15));
    expect(DateTime.isDateTime(dt)).toBe(true);
  });

  it('returns undefined for a non-ISO string', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.toDate('not a date')).toBeUndefined();
  });
});

describe('useLocale — formatDate', () => {
  it('returns undefined for undefined date', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.formatDate(undefined)).toBeUndefined();
  });

  it('formats using an explicit Luxon format string', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    const formatted = result.current.formatDate('2024-06-15T00:00:00Z', { format: 'yyyy/MM/dd' });
    expect(formatted).toBe('2024/06/15');
  });

  it('uses shortDateFormat from settings when type is short', () => {
    function wrapperWithShort({ children }: { children: ReactNode }) {
      return createElement(LocaleProvider, { settings: { ...defaultSettings, shortDateFormat: 'dd-MM-yyyy' }, children });
    }
    const { result } = renderHook(() => useLocale(), { wrapper: wrapperWithShort });
    const formatted = result.current.formatDate('2024-06-15T00:00:00Z', { type: 'short' });
    expect(formatted).toBe('15-06-2024');
  });

  it('uses longDateFormat from settings when type is long', () => {
    function wrapperWithLong({ children }: { children: ReactNode }) {
      return createElement(LocaleProvider, { settings: { ...defaultSettings, longDateFormat: 'dd MMMM yyyy' }, children });
    }
    const { result } = renderHook(() => useLocale(), { wrapper: wrapperWithLong });
    const formatted = result.current.formatDate('2024-06-15T00:00:00Z');
    expect(formatted).toBe('15 June 2024');
  });
});

describe('useLocale — formatCurrency', () => {
  it('returns undefined for undefined input', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.formatCurrency(undefined)).toBeUndefined();
  });

  it('formats a number as currency and contains currency symbol', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    const formatted = result.current.formatCurrency(1234.56);
    expect(formatted).toBeDefined();
    expect(formatted).toMatch(/£|GBP/);
  });
});

describe('useLocale — formatNumber', () => {
  it('returns undefined for undefined input', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.formatNumber(undefined)).toBeUndefined();
  });

  it('formats integer with 0 decimal places', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    const formatted = result.current.formatNumber(1234);
    expect(formatted).not.toContain('.');
  });

  it('formats with 2 decimal places', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    const formatted = result.current.formatNumber(1.5, 2);
    expect(formatted).toContain('.');
  });
});

describe('useLocale — formatPercentage', () => {
  it('returns undefined for undefined input', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.formatPercentage(undefined)).toBeUndefined();
  });

  it('formats 0.5 as approximately 50%', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    const formatted = result.current.formatPercentage(0.5);
    expect(formatted).toMatch(/50/);
    expect(formatted).toContain('%');
  });
});
