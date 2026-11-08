import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactListItem } from '../../models';
import { DropDown } from '../DropDown';
import { Radio } from '../Radio';
import { Text } from '../Text';
import { Password } from '../Password';

// Staff who use a screen reader meet every form through these fields (Vision sc-3004): each control must be named by its
// label, tied to its error or help text, and marked invalid while it has an error.

const CHOICES: ReactListItem[] = [
  { id: 'to-fit', text: 'To fit' },
  { id: 'fitted', text: 'Fitted' },
  { id: 'problem', text: 'Problem' },
];

describe('Text field accessibility', () => {
  it('is found by its label', () => {
    render(<Text label="What is wrong" />);
    expect(screen.getByRole('textbox', { name: 'What is wrong' })).toBeInTheDocument();
  });

  it('names a multi-line box by its label', () => {
    render(<Text label="Notes" multiline={3} />);
    expect(screen.getByRole('textbox', { name: 'Notes' })).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('names a password box by its label', () => {
    const { container } = render(<Password label="Your password" />);
    expect(container.querySelector('input[type="password"]')).toHaveAccessibleName('Your password');
  });

  it('reports invalid and is described by its error text when it has an error', () => {
    render(<Text label="What is wrong" error="Tell us what is wrong" />);
    const box = screen.getByRole('textbox', { name: 'What is wrong' });
    expect(box).toBeInvalid();
    expect(box).toHaveAccessibleDescription('Tell us what is wrong');
  });

  it('announces the error as an alert, once it appears', () => {
    const { rerender } = render(<Text label="What is wrong" />);
    expect(screen.queryByRole('alert')).toBeNull();
    rerender(<Text label="What is wrong" error="Tell us what is wrong" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Tell us what is wrong');
  });

  it('is not invalid and has no description when there is no message', () => {
    render(<Text label="What is wrong" />);
    const box = screen.getByRole('textbox', { name: 'What is wrong' });
    expect(box).toBeValid();
    expect(box).not.toHaveAttribute('aria-describedby');
  });

  it('is described by its help text, without being invalid', () => {
    render(<Text label="What is wrong" assistiveHelp="Up to 4,000 characters" />);
    const box = screen.getByRole('textbox', { name: 'What is wrong' });
    expect(box).toBeValid();
    expect(box).toHaveAccessibleDescription('Up to 4,000 characters');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('has no accessible name when it has no label, and does not point at a missing one', () => {
    render(<Text />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-labelledby');
  });

  it('points at exactly one description element', () => {
    render(<Text label="What is wrong" error="Tell us what is wrong" />);
    const describedBy = screen.getByRole('textbox').getAttribute('aria-describedby') ?? '';
    expect(describedBy.split(' ')).toHaveLength(1);
    expect(document.querySelectorAll(`[id="${describedBy}"]`)).toHaveLength(1);
  });
});

describe('DropDown accessibility', () => {
  it('names its focusable control by the label and the current value, never just "button"', () => {
    render(<DropDown label="Fit status" values={CHOICES} value="fitted" />);
    expect(screen.getByRole('button', { name: 'Fit status Fitted' })).toBeInTheDocument();
  });

  it('names its control by the label alone while nothing is chosen', () => {
    render(<DropDown label="Fit status" values={CHOICES} />);
    expect(screen.getByRole('button', { name: /^Fit status/ })).toBeInTheDocument();
  });

  it('reports a popup and its error on the control', () => {
    render(<DropDown label="Fit status" values={CHOICES} error="Choose one" />);
    const control = screen.getByRole('button', { name: /^Fit status/ });
    expect(control).toHaveAttribute('aria-haspopup', 'listbox');
    expect(control).toBeInvalid();
    expect(control).toHaveAccessibleDescription('Choose one');
  });
});

describe('Radio accessibility', () => {
  it('is a radio group named by its label', () => {
    render(<Radio label="Fit status" values={CHOICES} value="fitted" />);
    expect(screen.getByRole('radiogroup', { name: 'Fit status' })).toBeInTheDocument();
  });

  it('exposes each choice as a radio, with only the chosen one checked', () => {
    render(<Radio label="Fit status" values={CHOICES} value="fitted" />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'To fit' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Fitted' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Problem' })).not.toBeChecked();
  });

  it('checks nothing while nothing is chosen', () => {
    render(<Radio label="Fit status" values={CHOICES} isOptional />);
    screen.getAllByRole('radio').forEach(radio => expect(radio).not.toBeChecked());
  });

  it('is one tab stop: the chosen choice, or the first while none is chosen', () => {
    const { unmount } = render(<Radio label="Fit status" values={CHOICES} value="problem" />);
    expect(screen.getAllByRole('radio').map(radio => radio.tabIndex)).toEqual([-1, -1, 0]);
    unmount();
    render(<Radio label="Fit status" values={CHOICES} isOptional />);
    expect(screen.getAllByRole('radio').map(radio => radio.tabIndex)).toEqual([0, -1, -1]);
  });

  it('moves to and chooses the next choice with the arrow keys, wrapping at the ends', () => {
    const onChange = vi.fn();
    render(<Radio label="Fit status" values={CHOICES} value="problem" onChange={onChange} />);
    const last = screen.getByRole('radio', { name: 'Problem' });
    last.focus();
    fireEvent.keyDown(last, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenLastCalledWith('to-fit');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'To fit' }));
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'ArrowUp' });
    expect(onChange).toHaveBeenLastCalledWith('problem');
  });

  it('describes the group by its help text', () => {
    render(<Radio label="Fit status" values={CHOICES} assistiveHelp="Pick the state of the fit" />);
    const group = screen.getByRole('radiogroup', { name: 'Fit status' });
    expect(group).toBeValid();
    expect(group).toHaveAccessibleDescription('Pick the state of the fit');
  });
});
