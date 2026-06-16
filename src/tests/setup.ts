import '@testing-library/jest-dom/vitest';
import '@anupheaus/common';
import { TextDecoder, TextEncoder } from 'util';
import React from 'react';
import ReactDOM from 'react-dom';

class MockObserver {
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
  takeRecords() { return []; }
}

Object.assign(globalThis, { TextEncoder, TextDecoder, React, ReactDOM });

// jsdom does not implement these observers; provide safe defaults so components that
// instantiate them on mount (e.g. Scroller) work across the whole test suite. Individual
// tests can still override these via Object.defineProperty as they are configurable.
for (const name of ['ResizeObserver', 'IntersectionObserver'] as const) {
  if (typeof (globalThis as Record<string, unknown>)[name] === 'undefined') {
    Object.defineProperty(globalThis, name, { writable: true, configurable: true, value: MockObserver });
  }
}
