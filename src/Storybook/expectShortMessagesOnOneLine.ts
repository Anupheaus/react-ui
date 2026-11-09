import type { StoryContext } from '@storybook/react-webpack5';
import { expect } from 'storybook/test';

/** Every story whose name includes this is a component's UI States gallery (`createStorybookComponentStates`). */
const UI_STATES_STORY_NAME = 'UI States';

/** One line of text is about one font size tall; more than one and a half font sizes means it wrapped. */
const ONE_LINE_HEIGHT_IN_FONT_SIZES = 1.5;

/** The width the label's text needs to sit on one line, in px. */
function measureOneLineWidth(label: HTMLElement): number {
  const text = label.firstElementChild instanceof HTMLElement ? label.firstElementChild : label;
  const { whiteSpace } = text.style;
  text.style.whiteSpace = 'nowrap';
  const width = text.scrollWidth;
  text.style.whiteSpace = whiteSpace;
  return width;
}

/**
 * A message that wrapped although it should not have: its field is sized by its content (so the message holds it open
 * on one line), or the field has a set width the message fits. One wider than a set-width field must wrap.
 */
function wrapsAlthoughItFits(label: HTMLElement): boolean {
  if ((label.textContent ?? '').trim().length === 0) return false;
  const oneLineHeight = parseFloat(getComputedStyle(label).fontSize) * ONE_LINE_HEIGHT_IN_FONT_SIZES;
  if (label.getBoundingClientRect().height <= oneLineHeight) return false;
  const field = label.parentElement;
  const hasSetWidth = field != null && field.style.width !== '';
  if (!hasSetWidth) return true;
  return measureOneLineWidth(label) <= field.clientWidth;
}

function describeLabel(label: HTMLElement): string {
  const text = (label.textContent ?? '').trim();
  return `"${text}" is ${label.getBoundingClientRect().height}px tall in a ${label.parentElement?.clientWidth}px field`;
}

/**
 * Runs after every story (the preview's `afterEach`). In every UI States gallery, a field's helper or error message that
 * fits its field stays on one line: those galleries shrink their fields to fit, and a short message holds its field open
 * as it always has rather than wrap after every word (Vision sc-2955). It runs for every story, so a new UI States story
 * is covered too.
 */
export async function expectShortMessagesOnOneLine({ name, canvasElement }: StoryContext): Promise<void> {
  if (!name.includes(UI_STATES_STORY_NAME)) return;
  const labels = Array.from(canvasElement.querySelectorAll<HTMLElement>('assistive-label'));
  const wrapped = labels.filter(wrapsAlthoughItFits).map(describeLabel);
  await expect(wrapped, `short messages wrapped in "${name}"`).toEqual([]);
}
