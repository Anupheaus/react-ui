import type { ReactNode } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Window } from './Window';
import { WindowHeader } from './WindowHeader';
import { WindowContent } from './WindowContent';
import { Dialog } from '../../Dialog/Dialog';
import { WindowRenderContext } from '../WindowsContexts';
import { WindowsManager } from '../WindowsManager';

const MANAGER_ID = 'window-header-tests';
const WINDOW_ID = 'window-header-test-window';

interface HarnessProps {
  contextTitle?: ReactNode;
  children: ReactNode;
}

function Harness({ contextTitle, children }: HarnessProps) {
  return (
    <WindowRenderContext.Provider value={{ id: WINDOW_ID, managerId: MANAGER_ID, title: contextTitle }}>
      {children}
    </WindowRenderContext.Provider>
  );
}

function getTitlebars(container: HTMLElement) {
  return container.querySelectorAll('titlebar');
}

function getCloseButton(container: HTMLElement) {
  return container.querySelector('titlebar-end-adornment button:last-of-type') as HTMLButtonElement | null;
}

beforeEach(() => {
  const manager = WindowsManager.getOrCreate(MANAGER_ID, `${MANAGER_ID}-instance`, 'windows');
  manager.add([{ id: WINDOW_ID, definitionId: 'WindowHeaderTest', args: [] }]);
});

afterEach(() => {
  WindowsManager.remove(MANAGER_ID);
});

describe('Window header', () => {
  it('renders the default header with the window title when no Header is used', () => {
    const { container } = render(<Harness><Window title="Base title"><WindowContent>body</WindowContent></Window></Harness>);
    expect(getTitlebars(container)).toHaveLength(1);
    expect(container.querySelector('titlebar-title')?.textContent).toBe('Base title');
  });

  it('renders a consumer Header exactly once and above the content, even when declared after it', () => {
    const { container } = render(
      <Harness>
        <Window title="Base title">
          <WindowContent>body</WindowContent>
          <WindowHeader>custom-header-content</WindowHeader>
        </Window>
      </Harness>,
    );
    const titlebars = getTitlebars(container);
    const content = container.querySelector('window-content')!;
    expect(titlebars).toHaveLength(1);
    expect(titlebars[0].compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(content.textContent).not.toContain('custom-header-content');
  });

  it('finds a Header declared inside a fragment', () => {
    const { container } = render(
      <Harness>
        <Window title="Base title">
          <><WindowHeader title="Fragment title" /></>
          <WindowContent>body</WindowContent>
        </Window>
      </Harness>,
    );
    expect(getTitlebars(container)).toHaveLength(1);
    expect(container.querySelector('titlebar-title')?.textContent).toBe('Fragment title');
  });

  it('renders Header children between the title and the window buttons', () => {
    const { container } = render(
      <Harness><Window title="Base title"><WindowHeader><span>header-child</span></WindowHeader></Window></Harness>,
    );
    expect(container.querySelector('titlebar-content')?.textContent).toBe('header-child');
  });

  it('uses the Header title in preference to the Window title', () => {
    const { container } = render(<Harness><Window title="Base title"><WindowHeader title="Header title" /></Window></Harness>);
    expect(container.querySelector('titlebar-title')?.textContent).toBe('Header title');
  });

  it('uses a title set via setTitle in preference to the Header title', () => {
    const { container } = render(
      <Harness contextTitle="Runtime title"><Window title="Base title"><WindowHeader title="Header title" /></Window></Harness>,
    );
    expect(container.querySelector('titlebar-title')?.textContent).toBe('Runtime title');
  });

  it('uses the Header icon in preference to the Window icon', () => {
    const { container } = render(
      <Harness>
        <Window icon={<i data-icon="window" />}><WindowHeader icon={<i data-icon="header" />} /></Window>
      </Harness>,
    );
    expect(container.querySelector('titlebar [data-icon="header"]')).not.toBeNull();
    expect(container.querySelector('titlebar [data-icon="window"]')).toBeNull();
  });

  it('replaces the title rendering with renderTitle, passing the resolved title', () => {
    const renderTitle = vi.fn((title: ReactNode) => <b data-custom-title>[{title}]</b>);
    const { container } = render(
      <Harness><Window title="Base title"><WindowHeader title="Header title" renderTitle={renderTitle} /></Window></Harness>,
    );
    expect(renderTitle).toHaveBeenCalledWith('Header title');
    expect(container.querySelector('titlebar [data-custom-title]')?.textContent).toBe('[Header title]');
    expect(container.querySelector('titlebar-title')).toBeNull();
  });

  it('replaces the icon rendering with renderIcon, passing the resolved icon', () => {
    const windowIcon = <i data-icon="window" />;
    const renderIcon = vi.fn(() => <i data-icon="rendered" />);
    const { container } = render(
      <Harness><Window icon={windowIcon}><WindowHeader renderIcon={renderIcon} /></Window></Harness>,
    );
    expect(renderIcon).toHaveBeenCalledWith(windowIcon);
    expect(container.querySelector('titlebar [data-icon="rendered"]')).not.toBeNull();
    expect(container.querySelector('titlebar [data-icon="window"]')).toBeNull();
  });

  it('keeps a working close button when a custom Header is used', async () => {
    const closeRequested = vi.fn();
    // The close animation never completes in jsdom, so assert the manager was asked to close this window rather than waiting for removal.
    WindowsManager.get(MANAGER_ID).subscribeToEventChanges(WINDOW_ID, ({ allowClosing, closing }) => {
      if (allowClosing != null || closing != null) closeRequested();
    });
    const { container } = render(<Harness><Window title="Base title"><WindowHeader title="Header title" /></Window></Harness>);
    fireEvent.click(getCloseButton(container)!);
    await waitFor(() => expect(closeRequested).toHaveBeenCalled());
  });

  it('still hides the close button when hideCloseButton is set on the Window', () => {
    const { container } = render(
      <Harness><Window title="Base title" hideCloseButton hideMaximizeButton><WindowHeader title="Header title" /></Window></Harness>,
    );
    expect(getCloseButton(container)).toBeNull();
  });

  it('throws when more than one Header is declared in a window', () => {
    vi.spyOn(console, 'error').mockImplementation(() => void 0);
    expect(() => render(
      <Harness><Window><WindowHeader title="One" /><WindowHeader title="Two" /></Window></Harness>,
    )).toThrow(/more than one/i);
  });

  it('throws when a Header is nested inside another component rather than being a direct child of the Window', () => {
    vi.spyOn(console, 'error').mockImplementation(() => void 0);
    expect(() => render(
      <Harness><Window><WindowContent><WindowHeader title="Nested" /></WindowContent></Window></Harness>,
    )).toThrow(/direct child/i);
  });
});

describe('Dialog header', () => {
  it('renders a consumer Header in a dialog', () => {
    const { container } = render(
      <Harness><Dialog title="Base title"><WindowHeader title="Dialog header title">dialog-extra</WindowHeader></Dialog></Harness>,
    );
    expect(getTitlebars(container)).toHaveLength(1);
    expect(container.querySelector('titlebar-title')?.textContent).toBe('Dialog header title');
    expect(container.querySelector('titlebar-content')?.textContent).toBe('dialog-extra');
  });
});
