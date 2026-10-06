import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { DefaultTheme, ThemeProvider } from '../../theme';
import { Dialogs } from '../Dialog/Dialogs';
import { List } from '../List';

// A row with an `onClick` is the thing you press, so it must work from the keyboard as well as the mouse: Enter or Space on
// a focused clickable row does what a click does. A row with no click does nothing, and a key typed into a control inside
// the row belongs to that control.

class MockResizeObserver {
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'ResizeObserver', { writable: true, configurable: true, value: MockResizeObserver });
});

function renderList(items: React.ComponentProps<typeof List>['items']) {
  return render(<ThemeProvider theme={DefaultTheme}><Dialogs><List label="Things" items={items} /></Dialogs></ThemeProvider>);
}

const rowOf = async (text: string) => (await screen.findByText(text)).closest('list-item') as HTMLElement;

describe('InternalListItem keyboard activation', () => {
  it.each(['Enter', ' '])('fires a clickable row\'s onClick on %j', async key => {
    const onClick = vi.fn();
    renderList([{ id: 'one', text: 'Roller Blind', onClick }]);

    fireEvent.keyDown(await rowOf('Roller Blind'), { key });

    await waitFor(() => expect(onClick).toHaveBeenCalledTimes(1));
  });

  it('does nothing on a row that has no click', async () => {
    const onClick = vi.fn();
    renderList([{ id: 'one', text: 'Venetian Blind' }, { id: 'two', text: 'Roller Blind', onClick }]);

    fireEvent.keyDown(await rowOf('Venetian Blind'), { key: 'Enter' });

    expect(onClick).not.toHaveBeenCalled();
  });

  it('ignores other keys', async () => {
    const onClick = vi.fn();
    renderList([{ id: 'one', text: 'Roller Blind', onClick }]);

    fireEvent.keyDown(await rowOf('Roller Blind'), { key: 'a' });

    expect(onClick).not.toHaveBeenCalled();
  });

  it('leaves a key typed into an input inside the row to that input', async () => {
    const onClick = vi.fn();
    renderList([{ id: 'one', text: 'Roller Blind', onClick, label: <input aria-label="note" /> }]);

    fireEvent.keyDown(await screen.findByLabelText('note'), { key: 'Enter' });

    expect(onClick).not.toHaveBeenCalled();
  });
});
