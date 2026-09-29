import { fitWindowToContent } from './fitWindowToContent';

// A dialog is sized to its content when it opens. When the content then grows (a choice adds fields), the dialog
// grows with it rather than squeezing the new content into a scrolled strip, and gives that growth back when the content
// goes again (sc-693). It never shrinks a window it has not grown.

const SPACE = { width: 1280, height: 800 };
const OPENED = 200;

describe('fitWindowToContent', () => {
  it('grows the window by as much as its content overflows, centred in the space', () => {
    expect(fitWindowToContent({ window: { width: 420, height: 200 }, overflow: { x: 0, y: 150 }, space: SPACE, openedHeight: OPENED, canShrink: false }))
      .toEqual({ width: 420, height: 350, x: 430, y: 225 });
  });

  it('grows wider when the content is wider than the window, so it never scrolls sideways', () => {
    expect(fitWindowToContent({ window: { width: 420, height: 300 }, overflow: { x: 80, y: 0 }, space: SPACE, openedHeight: OPENED, canShrink: false }))
      .toEqual({ width: 500, height: 300, x: 390, y: 250 });
  });

  it('stops at the size of the space, beyond which the content scrolls', () => {
    expect(fitWindowToContent({ window: { width: 420, height: 600 }, overflow: { x: 0, y: 900 }, space: SPACE, openedHeight: OPENED, canShrink: false }))
      .toEqual({ width: 420, height: 800, x: 430, y: 0 });
  });

  it('gives back growth when its content gets shorter, so no empty band is left above its buttons', () => {
    expect(fitWindowToContent({ window: { width: 420, height: 300 }, overflow: { x: 0, y: -40 }, space: SPACE, openedHeight: OPENED, canShrink: true }))
      .toEqual({ width: 420, height: 260, x: 430, y: 270 });
  });

  it('never gives back more than it grew by: not below the height it opened at', () => {
    expect(fitWindowToContent({ window: { width: 420, height: 300 }, overflow: { x: 0, y: -250 }, space: SPACE, openedHeight: OPENED, canShrink: true }))
      .toEqual({ width: 420, height: 200, x: 430, y: 300 });
  });

  it('never shrinks a window it has not grown, such as one whose full-height list is shorter than it', () => {
    expect(fitWindowToContent({ window: { width: 420, height: 560 }, overflow: { x: 0, y: -400 }, space: SPACE, openedHeight: 560, canShrink: false })).toBeUndefined();
  });

  it('leaves a window whose content fits exactly as it is', () => {
    expect(fitWindowToContent({ window: { width: 420, height: 300 }, overflow: { x: -30, y: 0 }, space: SPACE, openedHeight: OPENED, canShrink: true })).toBeUndefined();
  });

  it('leaves a window already as big as the space as it is', () => {
    expect(fitWindowToContent({ window: { width: 420, height: 800 }, overflow: { x: 0, y: 200 }, space: SPACE, openedHeight: OPENED, canShrink: false })).toBeUndefined();
  });
});
