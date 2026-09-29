import { fitWindowToContent } from './fitWindowToContent';

// A dialog is sized to its content when it opens. When the content then grows (a choice adds fields), the dialog
// grows with it rather than squeezing the new content into a scrolled strip (sc-693).

const SPACE = { width: 1280, height: 800 };

describe('fitWindowToContent', () => {
  it('grows the window by as much as its content overflows, centred in the space', () => {
    expect(fitWindowToContent({ window: { width: 420, height: 200 }, overflow: { x: 0, y: 150 }, space: SPACE }))
      .toEqual({ width: 420, height: 350, x: 430, y: 225 });
  });

  it('grows wider when the content is wider than the window, so it never scrolls sideways', () => {
    expect(fitWindowToContent({ window: { width: 420, height: 300 }, overflow: { x: 80, y: 0 }, space: SPACE }))
      .toEqual({ width: 500, height: 300, x: 390, y: 250 });
  });

  it('stops at the size of the space, beyond which the content scrolls', () => {
    expect(fitWindowToContent({ window: { width: 420, height: 600 }, overflow: { x: 0, y: 900 }, space: SPACE }))
      .toEqual({ width: 420, height: 800, x: 430, y: 0 });
  });

  it('leaves a window whose content fits as it is', () => {
    expect(fitWindowToContent({ window: { width: 420, height: 300 }, overflow: { x: 0, y: -40 }, space: SPACE })).toBeUndefined();
  });

  it('leaves a window already as big as the space as it is', () => {
    expect(fitWindowToContent({ window: { width: 420, height: 800 }, overflow: { x: 0, y: 200 }, space: SPACE })).toBeUndefined();
  });
});
