import type { CrowdedTitlebarState } from './crowdedTitlebar';
import { nextCrowdedTitlebarState } from './crowdedTitlebar';

const ONE_ROW: CrowdedTitlebarState = { isCrowded: false };

describe('nextCrowdedTitlebarState', () => {
  it('stays on one row while its parts fit', () => {
    expect(nextCrowdedTitlebarState(ONE_ROW, { scrollWidth: 800, clientWidth: 800, isHeadingSqueezed: false })).toBe(ONE_ROW);
  });

  it('ignores a sub-pixel difference between the two widths', () => {
    expect(nextCrowdedTitlebarState(ONE_ROW, { scrollWidth: 800.5, clientWidth: 800, isHeadingSqueezed: false })).toBe(ONE_ROW);
  });

  it('wraps when the title is squeezed to nothing, even though everything else fits the width', () => {
    expect(nextCrowdedTitlebarState(ONE_ROW, { scrollWidth: 270, clientWidth: 270, isHeadingSqueezed: true })).toEqual({ isCrowded: true, crowdedAtWidth: 270 });
  });

  it('wraps once its parts need more width than it has, and remembers the width', () => {
    expect(nextCrowdedTitlebarState(ONE_ROW, { scrollWidth: 640, clientWidth: 270, isHeadingSqueezed: false })).toEqual({ isCrowded: true, crowdedAtWidth: 270 });
  });

  it('stays wrapped while it is no wider than when it wrapped', () => {
    const crowded: CrowdedTitlebarState = { isCrowded: true, crowdedAtWidth: 270 };
    expect(nextCrowdedTitlebarState(crowded, { scrollWidth: 270, clientWidth: 270, isHeadingSqueezed: false })).toBe(crowded);
    expect(nextCrowdedTitlebarState(crowded, { scrollWidth: 200, clientWidth: 200, isHeadingSqueezed: false })).toBe(crowded);
  });

  it('tries one row again once it is wider than when it wrapped', () => {
    const crowded: CrowdedTitlebarState = { isCrowded: true, crowdedAtWidth: 270 };
    expect(nextCrowdedTitlebarState(crowded, { scrollWidth: 270, clientWidth: 900, isHeadingSqueezed: false })).toEqual({ isCrowded: false });
  });

  it('wraps again at the new width when one row still does not fit', () => {
    const retrying = nextCrowdedTitlebarState({ isCrowded: true, crowdedAtWidth: 270 }, { scrollWidth: 270, clientWidth: 400, isHeadingSqueezed: false });
    expect(nextCrowdedTitlebarState(retrying, { scrollWidth: 640, clientWidth: 400, isHeadingSqueezed: false })).toEqual({ isCrowded: true, crowdedAtWidth: 400 });
  });
});
