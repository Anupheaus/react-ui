import { act, render } from '@testing-library/react';
import { Windows } from './Windows';
import { WindowsManager, WINDOWS_DEFAULT_ID } from './WindowsManager';
import type { WindowState } from './WindowsModels';

// An app that swaps one screen for another in a single render (e.g. its main screen for a billing screen when its licence
// lapses) unmounts one default Windows and mounts another in the same commit. The new one renders while the old is
// still mounted, so it must take the default manager over instead of throwing, and the old one going must not clear or
// unregister what the new one now holds.

const STORAGE_KEY = 'windows-handover-tests';

function windowState(id: string): WindowState {
  return { id, definitionId: id, windowTypeName: id, args: [], x: 10, y: 10, width: 400, height: 300 };
}

function Screen({ name, states }: { name: string; states: WindowState[]; }) {
  return <div data-screen={name}><Windows states={states} /></div>;
}

function App({ screen }: { screen: 'main' | 'billing'; }) {
  return screen === 'main'
    ? <Screen key="main" name="main" states={[windowState('main-window')]} />
    : <Screen key="billing" name="billing" states={[windowState('billing-window')]} />;
}

afterEach(() => {
  WindowsManager.remove(WINDOWS_DEFAULT_ID);
  window.localStorage.removeItem(STORAGE_KEY);
});

describe('swapping one default Windows for another in one render', () => {
  it('does not throw', () => {
    const { rerender } = render(<App screen="main" />);
    expect(() => act(() => { rerender(<App screen="billing" />); })).not.toThrow();
  });

  it('leaves the new Windows holding the default manager with its own windows', () => {
    const { rerender } = render(<App screen="main" />);
    act(() => { rerender(<App screen="billing" />); });

    expect(WindowsManager.get(WINDOWS_DEFAULT_ID).entries.ids()).toEqual(['billing-window']);
  });

  it('still frees the default manager when the last Windows goes', () => {
    const { rerender, unmount } = render(<App screen="main" />);
    act(() => { rerender(<App screen="billing" />); });
    unmount();

    expect(() => WindowsManager.get(WINDOWS_DEFAULT_ID)).toThrow('not found');
  });

  it('still refuses two default Windows mounted at once', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => void 0);
    try {
      expect(() => render(<><Windows /><Windows /></>)).toThrow('cannot both be default');
    } finally {
      consoleError.mockRestore();
    }
  });
});
