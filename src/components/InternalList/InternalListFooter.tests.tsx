import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { useState } from 'react';
import { DefaultTheme, ThemeProvider } from '../../theme';
import { Dialogs } from '../Dialog/Dialogs';
import { Checkbox } from '../Checkbox';
import { InternalListFooter } from './InternalListFooter';
import type { ListFilter } from './ListFilterDialog';
import { List } from '../List';

// A List or Table filters from its footer: a Filter button, left of the count, with a badge of how many filters are
// active. The screen either hands the footer its fields (the footer opens its own dialog: Apply, Clear, Cancel) or a
// callback that opens the screen's own dialog. With neither, there is no button.

class MockResizeObserver {
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'ResizeObserver', { writable: true, configurable: true, value: MockResizeObserver });
});

interface Filters { isLateOnly: boolean }

/** A screen filtering with fields: the applied filters live here, and change only on Apply or Clear. */
function ScreenWithFields({ initial }: { initial: Filters }) {
  const [value, setValue] = useState(initial);
  const filter: ListFilter<Filters> = {
    value,
    defaultValue: { isLateOnly: false },
    onChange: setValue,
    countActive: ({ isLateOnly }) => (isLateOnly ? 1 : 0),
    title: 'Filter Tasks',
    renderFields: (draft, setDraft) => <Checkbox label="Only late tasks" value={draft.isLateOnly} onChange={isLateOnly => setDraft({ isLateOnly })} />,
  };
  return (
    <>
      <InternalListFooter total={3} unitName="task" filter={filter} />
      <span data-testid="applied">{value.isLateOnly ? 'late only' : 'all'}</span>
    </>
  );
}

function renderInApp(children: React.ReactNode) {
  return render(<ThemeProvider theme={DefaultTheme}><Dialogs>{children}</Dialogs></ThemeProvider>);
}

const filterButton = () => screen.getByTestId('list-filter-button');
const badge = () => document.querySelector('.MuiBadge-badge:not(.MuiBadge-invisible)');

describe('InternalListFooter filter', () => {
  it('shows no Filter button when the screen gives no filtering', () => {
    renderInApp(<InternalListFooter total={3} unitName="task" />);

    expect(screen.queryByTestId('list-filter-button')).toBeNull();
  });

  it('calls the screen\'s own filter callback, and badges the active count', async () => {
    const onFilter = vi.fn();
    renderInApp(<InternalListFooter total={3} unitName="task" onFilter={onFilter} activeFilterCount={2} />);

    expect(filterButton().textContent).toContain('Filter');
    expect(badge()?.textContent).toBe('2');
    fireEvent.click(filterButton());
    await waitFor(() => expect(onFilter).toHaveBeenCalledTimes(1));
  });

  it('shows no badge when no filter is active', () => {
    renderInApp(<InternalListFooter total={3} unitName="task" onFilter={vi.fn()} activeFilterCount={0} />);

    expect(badge()).toBeNull();
  });

  it('opens its own dialog for the screen\'s fields, and applies the draft only on Apply', async () => {
    renderInApp(<ScreenWithFields initial={{ isLateOnly: false }} />);

    fireEvent.click(filterButton());
    fireEvent.click(await screen.findByText('Only late tasks'));
    expect(screen.getByTestId('applied').textContent).toBe('all');
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    await waitFor(() => expect(screen.getByTestId('applied').textContent).toBe('late only'));
    expect(badge()?.textContent).toBe('1');
  });

  it('changes nothing on Cancel, and goes back to the defaults on Clear', async () => {
    renderInApp(<ScreenWithFields initial={{ isLateOnly: true }} />);

    fireEvent.click(filterButton());
    fireEvent.click(await screen.findByText('Only late tasks'));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByText('Only late tasks')).toBeNull(), { timeout: 5_000 });
    expect(screen.getByTestId('applied').textContent).toBe('late only');

    fireEvent.click(filterButton());
    fireEvent.click(await screen.findByTestId('list-filter-clear'));
    await waitFor(() => expect(screen.getByTestId('applied').textContent).toBe('all'));
  });

  it('adds words after the count', () => {
    renderInApp(<InternalListFooter total={3} unitName="task" totalSuffix="assigned to you" />);

    expect(document.querySelector('internal-list-footer-total')?.textContent?.replace(/\s+/g, ' ')).toBe('3 tasks assigned to you');
  });
});

describe('List empty message', () => {
  it('says what to do when the list has no items, and nothing once it has some', async () => {
    const { rerender } = renderInApp(<List label="Tasks" items={[]} emptyMessage="No tasks yet. Press Add task to create one." />);

    expect(await screen.findByText('No tasks yet. Press Add task to create one.')).toBeTruthy();
    rerender(<ThemeProvider theme={DefaultTheme}><Dialogs><List label="Tasks" items={[{ id: 'one', text: 'Ring the customer' }]} emptyMessage="No tasks yet. Press Add task to create one." /></Dialogs></ThemeProvider>);
    await waitFor(() => expect(screen.queryByText('No tasks yet. Press Add task to create one.')).toBeNull());
  });
});
