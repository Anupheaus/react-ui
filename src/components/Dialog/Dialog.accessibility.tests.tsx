import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Dialog } from './Dialog';
import { Window } from '../Windows/Window';
import { WindowRenderContext } from '../Windows/WindowsContexts';
import { WindowsManager } from '../Windows/WindowsManager';

// A dialog must be announced as one, hold keyboard focus while it is open and hand focus back when it closes (Vision sc-3004).

const MANAGER_ID = 'dialog-accessibility-tests';
const WINDOW_ID = 'dialog-accessibility-test-window';

function Harness({ children }: { children: ReactNode; }) {
  return (
    <WindowRenderContext.Provider value={{ id: WINDOW_ID, managerId: MANAGER_ID }}>
      {children}
    </WindowRenderContext.Provider>
  );
}

function DialogWithButtons() {
  return (
    <Harness>
      <button>Back to calendar</button>
      <Dialog title="Message preview">
        <input aria-label="Subject" />
        <button>Cancel</button>
        <button>Save</button>
      </Dialog>
    </Harness>
  );
}

beforeEach(() => {
  const manager = WindowsManager.getOrCreate(MANAGER_ID, `${MANAGER_ID}-instance`, 'dialogs');
  manager.add([{ id: WINDOW_ID, definitionId: 'DialogAccessibilityTest', args: [] }]);
});

afterEach(() => {
  WindowsManager.remove(MANAGER_ID);
});

describe('Dialog accessibility', () => {
  it('is a modal dialog named by its title', () => {
    render(<DialogWithButtons />);
    const dialog = screen.getByRole('dialog', { name: 'Message preview' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('moves focus into itself when it opens, to its first control', () => {
    render(<DialogWithButtons />);
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Subject' }));
  });

  it('leaves focus alone when a control inside has already taken it', () => {
    render(
      <Harness>
        <Dialog title="Autofocus"><input aria-label="First" /><input aria-label="Second" autoFocus /></Dialog>
      </Harness>,
    );
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Second' }));
  });

  it('sends Tab from the last control to the first', () => {
    render(<DialogWithButtons />);
    const save = screen.getByRole('button', { name: 'Save' });
    save.focus();
    const wasNotPrevented = fireEvent.keyDown(save, { key: 'Tab' });
    expect(wasNotPrevented).toBe(false);
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Subject' }));
  });

  it('sends Shift+Tab from the first control to the last', () => {
    render(<DialogWithButtons />);
    const subject = screen.getByRole('textbox', { name: 'Subject' });
    subject.focus();
    const wasNotPrevented = fireEvent.keyDown(subject, { key: 'Tab', shiftKey: true });
    expect(wasNotPrevented).toBe(false);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Save' }));
  });

  it('lets Tab move normally between controls in the middle', () => {
    render(<DialogWithButtons />);
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    cancel.focus();
    expect(fireEvent.keyDown(cancel, { key: 'Tab' })).toBe(true);
    expect(fireEvent.keyDown(cancel, { key: 'Tab', shiftKey: true })).toBe(true);
  });

  it('keeps focus on the dialog when it has nothing to focus', () => {
    render(<Harness><Dialog title="Nothing to press">Just words</Dialog></Harness>);
    const dialog = screen.getByRole('dialog', { name: 'Nothing to press' });
    expect(document.activeElement).toBe(dialog);
    expect(fireEvent.keyDown(dialog, { key: 'Tab' })).toBe(false);
  });

  it('gives focus back to the control that opened it when it closes', () => {
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();
    const { unmount } = render(<DialogWithButtons />);
    expect(document.activeElement).not.toBe(opener);
    unmount();
    expect(document.activeElement).toBe(opener);
    opener.remove();
  });

  it('is not announced as a dialog when it is a plain window', () => {
    render(<Harness><Window title="Plain"><button>Go</button></Window></Harness>);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
