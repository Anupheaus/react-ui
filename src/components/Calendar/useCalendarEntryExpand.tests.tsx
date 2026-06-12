import { act, fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';
import { useCalendarEntryExpand } from './useCalendarEntryExpand';

// `isTouchEnvironment` is a module-level const evaluated at import time, so we mock the module
// it lives in to flip touch/non-touch per test. `setTouch(...)` controls what the hook reads.
let touchValue = false;
vi.mock('./calendarNavigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./calendarNavigation')>();
  return { ...actual, get isTouchEnvironment() { return touchValue; } };
});
function setTouch(value: boolean) { touchValue = value; }

class MockResizeObserver {
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'ResizeObserver', { writable: true, configurable: true, value: MockResizeObserver });
});

beforeEach(() => { setTouch(false); });

/**
 * Stub an element's box metrics. `truncated` makes scrollWidth exceed clientWidth so the hook's
 * layout effect flags the entry as truncated (content overflowing its box).
 */
function stubMetrics(el: HTMLElement, { truncated }: { truncated: boolean }) {
  const client = 100;
  const scroll = truncated ? 200 : 100;
  Object.defineProperty(el, 'clientWidth', { configurable: true, value: client });
  Object.defineProperty(el, 'clientHeight', { configurable: true, value: client });
  Object.defineProperty(el, 'scrollWidth', { configurable: true, value: scroll });
  Object.defineProperty(el, 'scrollHeight', { configurable: true, value: client });
}

interface HarnessProps {
  onSelect?: () => void;
  truncated: boolean;
  clickRef: { current: ((event: { stopPropagation(): void }) => void) | null };
}

// Renders a real element wired to the hook's `target`, stubs its box metrics before the hook's
// layout effect runs (ref callbacks fire before effects), and exposes the latest `onClick` so the
// test can invoke it after `isTruncated` has settled.
function Harness({ onSelect, truncated, clickRef }: HarnessProps) {
  const stubbed = useRef(false);
  const { target, onClick } = useCalendarEntryExpand('some long entry title', '#fff', onSelect);
  clickRef.current = onClick;
  return (
    <div
      ref={el => {
        if (el != null && !stubbed.current) { stubMetrics(el, { truncated }); stubbed.current = true; }
        target(el);
      }}
    >
      title
    </div>
  );
}

function renderHook(opts: { onSelect?: () => void; truncated: boolean }) {
  const clickRef: HarnessProps['clickRef'] = { current: null };
  render(<Harness onSelect={opts.onSelect} truncated={opts.truncated} clickRef={clickRef} />);
  // The layout effect that computes isTruncated runs synchronously inside render via act().
  const stopPropagation = vi.fn();
  const click = () => act(() => { clickRef.current?.({ stopPropagation }); });
  return { click, stopPropagation };
}

describe('useCalendarEntryExpand onClick', () => {
  it('non-touch: clicking a truncated entry selects immediately', () => {
    const onSelect = vi.fn();
    setTouch(false);
    const { click } = renderHook({ onSelect, truncated: true });
    click();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('non-touch: clicking a non-truncated entry selects immediately', () => {
    const onSelect = vi.fn();
    setTouch(false);
    const { click } = renderHook({ onSelect, truncated: false });
    click();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('touch: first tap on a truncated entry expands only and does NOT select', () => {
    const onSelect = vi.fn();
    setTouch(true);
    const { click } = renderHook({ onSelect, truncated: true });
    click();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('touch: tapping a non-truncated entry selects immediately (nothing to expand into)', () => {
    const onSelect = vi.fn();
    setTouch(true);
    const { click } = renderHook({ onSelect, truncated: false });
    click();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('always stops propagation so the click does not bubble past the entry', () => {
    const { click, stopPropagation } = renderHook({ onSelect: vi.fn(), truncated: false });
    click();
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('no onSelect provided: onClick is a safe no-op (does not throw)', () => {
    const { click } = renderHook({ truncated: false });
    expect(() => click()).not.toThrow();
  });
});

// CalendarDayViewEntries wires the hook's onClick as the entry's `onClickCapture`. The vision
// "Add contact" button is nested INSIDE the entry and relies on stopPropagation to keep its own
// click from also selecting the entry. Because the entry handler runs in the CAPTURE phase, it
// fires before the nested button's bubble-phase onClick — so the entry handler decides what wins.
// This documents that ordering: a capture handler that stops propagation suppresses the inner
// button entirely (the inner click never runs).
describe('onClickCapture vs nested button (Add contact interaction)', () => {
  it('entry onClickCapture fires before, and can suppress, a nested button onClick', () => {
    const entryHandler = vi.fn((e: { stopPropagation(): void }) => e.stopPropagation());
    const buttonHandler = vi.fn();
    const { getByTestId } = render(
      <div data-testid="entry" onClickCapture={entryHandler}>
        <button data-testid="add-contact" onClick={buttonHandler}>Add contact</button>
      </div>,
    );
    fireEvent.click(getByTestId('add-contact'));
    expect(entryHandler).toHaveBeenCalledTimes(1);
    expect(buttonHandler).not.toHaveBeenCalled();
  });
});
