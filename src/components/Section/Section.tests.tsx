import { render, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DefaultTheme, ThemeProvider } from '../../theme';
import { Section } from './Section';

// jsdom serialises an inline `min-width: 0` as the string '0' (a truthy length keeps its unit, e.g. '200px').
// Parse to a number so the assertion states the intent (min-width is 0) and still fails when it is unset ('' → NaN).
function inlineMinWidth(el: HTMLElement | null): number {
  return parseFloat(el?.style.minWidth ?? '');
}

function renderSection(maxHeight?: boolean) {
  const result = render(
    <ThemeProvider theme={DefaultTheme}>
      <div style={{ width: 400, height: 300, display: 'flex' }}>
        <Section label="Details" isVertical maxHeight={maxHeight}>
          <div>content</div>
        </Section>
      </div>
    </ThemeProvider>,
  );
  const section = result.container.querySelector('section') as HTMLElement | null;
  const sectionContents = result.container.querySelector('section-contents') as HTMLElement | null;
  return { section, sectionContents };
}

describe('Section', () => {
  // min-width:0 lets a self-scrolling child (e.g. a Table with resizable columns) shrink to the
  // section width instead of forcing the section — and its ancestors — wider. It must apply
  // regardless of maxHeight, which is the whole point of decoupling it from the fill/clip behaviour.
  it('applies min-width: 0 to section and section-contents when maxHeight is not set', async () => {
    const { section, sectionContents } = renderSection();
    await waitFor(() => {
      expect(section).not.toBeNull();
      expect(sectionContents).not.toBeNull();
      expect(inlineMinWidth(section)).toBe(0);
      expect(inlineMinWidth(sectionContents)).toBe(0);
    });
  });

  it('keeps min-width: 0 on section and section-contents when maxHeight is set', async () => {
    const { section, sectionContents } = renderSection(true);
    await waitFor(() => {
      expect(inlineMinWidth(section)).toBe(0);
      expect(inlineMinWidth(sectionContents)).toBe(0);
    });
  });

  // Guard the scoping: only min-width is unconditional. The heavier containment (width:100% via
  // `wide`) must stay gated on maxHeight, or non-maxHeight sections would start stretching to full
  // width and change existing layouts.
  it('does not stretch section-contents to width: 100% when maxHeight is not set', async () => {
    const { sectionContents } = renderSection();
    await waitFor(() => expect(sectionContents).not.toBeNull());
    expect(sectionContents!.style.width).not.toBe('100%');
  });

  it('stretches section-contents to width: 100% when maxHeight is set', async () => {
    const { sectionContents } = renderSection(true);
    await waitFor(() => expect(sectionContents!.style.width).toBe('100%'));
  });
});
