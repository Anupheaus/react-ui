import { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { UIState } from '../../providers/UIStateProvider';
import { Button } from './Button';

// A button that is held while it works (its UI state is loading) must stay findable: read by its name as disabled
// (aria-disabled, never the native attribute, which removes focus), still in the tab order, and pressing it does nothing.

interface HostProps {
  onSelect(): void;
  onClick?(): void;
  isHeld?: boolean;
}

function Host({ onSelect, onClick, isHeld = false }: HostProps) {
  return (
    <UIState isLoading={isHeld}>
      <Button onSelect={onSelect} onClick={onClick}>Send the copy</Button>
    </UIState>
  );
}

function ToggleHost({ onSelect }: { onSelect(): void }) {
  const [isHeld, setIsHeld] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setIsHeld(current => !current)}>toggle</button>
      <Host onSelect={onSelect} isHeld={isHeld} />
    </>
  );
}

const sendButton = () => screen.getByRole('button', { name: 'Send the copy' });

describe('Button held while it works', () => {
  it('is found by role and name, with aria-disabled true and no disabled attribute', () => {
    render(<Host onSelect={() => undefined} isHeld />);
    const button = sendButton();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).not.toHaveAttribute('disabled');
    expect(button).toHaveTextContent('Send the copy');
  });

  it('can receive focus and is in the tab order', () => {
    render(<Host onSelect={() => undefined} isHeld />);
    const button = sendButton();
    expect(button.tabIndex).toBeGreaterThanOrEqual(0);
    button.focus();
    expect(document.activeElement).toBe(button);
  });

  it('keeps focus when it becomes held, and is read as an ordinary button again once released', () => {
    const onSelect = vi.fn();
    render(<ToggleHost onSelect={onSelect} />);
    const button = sendButton();
    expect(button).not.toHaveAttribute('aria-disabled', 'true');
    button.focus();
    fireEvent.click(screen.getByText('toggle'));
    button.focus();
    expect(sendButton()).toBe(button);
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(document.activeElement).toBe(button);
    fireEvent.click(screen.getByText('toggle'));
    expect(sendButton()).not.toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(sendButton());
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('does not run its action when clicked, or when Enter or Space is pressed (a keyboard press is a click on a button)', () => {
    const onSelect = vi.fn();
    const onClick = vi.fn();
    render(<Host onSelect={onSelect} onClick={onClick} isHeld />);
    const button = sendButton();
    fireEvent.click(button);
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyUp(button, { key: ' ' });
    expect(onSelect).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('is not marked aria-disabled when it is not held, and runs its action', () => {
    const onSelect = vi.fn();
    render(<Host onSelect={onSelect} />);
    expect(sendButton()).not.toHaveAttribute('aria-disabled');
    fireEvent.click(sendButton());
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('is held while its own asynchronous action runs: aria-disabled, and a second press does not run it again', async () => {
    let finish: () => void = () => undefined;
    const onSelect = vi.fn(() => new Promise<void>(resolve => { finish = resolve; }));
    render(<Host onSelect={onSelect} />);
    await act(async () => { fireEvent.click(sendButton()); });
    expect(sendButton()).toHaveAttribute('aria-disabled', 'true');
    await act(async () => { fireEvent.click(sendButton()); });
    expect(onSelect).toHaveBeenCalledTimes(1);
    await act(async () => { finish(); });
    expect(sendButton()).not.toHaveAttribute('aria-disabled', 'true');
    await act(async () => { fireEvent.click(sendButton()); });
    expect(onSelect).toHaveBeenCalledTimes(2);
  });
});

describe('Button held: rejected action and look', () => {
  it('is released again when its action rejects, so it is never held for good', async () => {
    const onSelect = vi.fn(() => Promise.reject(new Error('the server said no')));
    // The button lets the rejection reach the host as before; this test is the host, so it takes it
    const runnerListeners = process.listeners('unhandledRejection');
    process.removeAllListeners('unhandledRejection');
    const unhandled = vi.fn();
    process.on('unhandledRejection', unhandled);
    try {
      render(<Host onSelect={onSelect} />);
      await act(async () => { fireEvent.click(sendButton()); });
      await act(async () => { await new Promise(resolve => setTimeout(resolve, 10)); });
      expect(sendButton()).not.toHaveAttribute('aria-disabled', 'true');
      await act(async () => { fireEvent.click(sendButton()); });
      await act(async () => { await new Promise(resolve => setTimeout(resolve, 10)); });
      expect(onSelect).toHaveBeenCalledTimes(2);
      expect(unhandled).toHaveBeenCalledTimes(2);
    } finally {
      process.removeAllListeners('unhandledRejection');
      runnerListeners.forEach(listener => process.on('unhandledRejection', listener));
    }
  });

  it('draws no face of its own under the skeleton: every background and border rule for a loading button is !important', () => {
    render(<Host onSelect={() => undefined} isHeld />);
    const button = sendButton();
    const loadingClass = Array.from(button.classList).find(name => name.includes('react-ui-button'));
    expect(button.className).toContain('is-loading');
    const rules = Array.from(document.styleSheets).flatMap(sheet => Array.from(sheet.cssRules)).map(rule => rule.cssText);
    const loadingRule = rules.find(text => text.includes('.is-loading') && text.includes('background-color'));
    expect(loadingClass, 'the button has its styled class').toBeDefined();
    expect(loadingRule, 'there is a rule for a loading button').toBeDefined();
    for (const property of ['background-color', 'background-image', 'box-shadow', 'color']) {
      expect(loadingRule, `${property} is !important`).toMatch(new RegExp(`(^|[ {;])${property}: [^;]*!important`));
    }
  });
});
