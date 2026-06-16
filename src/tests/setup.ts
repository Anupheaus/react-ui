import '@testing-library/jest-dom/vitest';
import '@anupheaus/common';
import { TextDecoder, TextEncoder } from 'util';
import React from 'react';
import ReactDOM from 'react-dom';

// jsdom does not implement ResizeObserver, which Scroller (and therefore any component that
// renders inside it, e.g. Wizard/Tabs) relies on. Provide a no-op stub so they mount in tests.
class ResizeObserverStub {
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
}

Object.assign(globalThis, { TextEncoder, TextDecoder, React, ReactDOM });
if (globalThis.ResizeObserver == null) globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
