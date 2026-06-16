import { fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import { WindowAction } from './WindowAction';
import { WindowRenderContext } from '../WindowsContexts';

describe('WindowAction', () => {
  it('uses the context close when provided, without touching the windows manager', () => {
    const close = vi.fn();
    // managerId intentionally does not refer to a real manager; the context close must be used instead.
    const { getByText } = render(
      <WindowRenderContext.Provider value={{ id: 'w1', managerId: 'no-such-manager', close }}>
        <WindowAction value="done">Finish</WindowAction>
      </WindowRenderContext.Provider>
    );
    fireEvent.click(getByText('Finish').closest('button')!);
    expect(close).toHaveBeenCalledWith('done');
  });
});
