import type { WindowPlacement } from './keepWindowInsideHost';
import { keepWindowInsideHost } from './keepWindowInsideHost';

const HOST = { width: 1024, height: 560 };
/** The windows host beside Vision's sidebar on a 1366-wide screen. */
const LAPTOP_HOST = { width: 1262, height: 560 };

interface PlacementCase {
  name: string;
  placement: WindowPlacement;
  expected: WindowPlacement;
}

const placementsAlreadyInside: PlacementCase[] = [
  { name: 'a window well inside', placement: { x: 100, y: 50, width: 400, height: 300 }, expected: { x: 100, y: 50, width: 400, height: 300 } },
  { name: 'a window at the top-left corner', placement: { x: 0, y: 0, width: 400, height: 300 }, expected: { x: 0, y: 0, width: 400, height: 300 } },
  { name: 'a window touching the bottom-right corner', placement: { x: 624, y: 260, width: 400, height: 300 }, expected: { x: 624, y: 260, width: 400, height: 300 } },
  { name: 'a window exactly the host size', placement: { x: 0, y: 0, width: 1024, height: 560 }, expected: { x: 0, y: 0, width: 1024, height: 560 } },
];

const placementsPartlyOutside: PlacementCase[] = [
  { name: 'a window taller than the host, centred (title bar above the top)', placement: { x: 0, y: -80, width: 1100, height: 720 }, expected: { x: 0, y: 0, width: 1024, height: 560 } },
  { name: 'a window wider than the host', placement: { x: 32, y: 0, width: 1400, height: 300 }, expected: { x: 0, y: 0, width: 1024, height: 300 } },
  { name: 'a remembered position off the right and bottom (another monitor)', placement: { x: 3000, y: 2000, width: 400, height: 300 }, expected: { x: 608, y: 244, width: 400, height: 300 } },
  { name: 'a remembered position off the left and top', placement: { x: -500, y: -40, width: 400, height: 300 }, expected: { x: 16, y: 16, width: 400, height: 300 } },
  { name: 'a window one pixel past the right edge', placement: { x: 625, y: 0, width: 400, height: 300 }, expected: { x: 608, y: 0, width: 400, height: 300 } },
  { name: 'a window with too little room for the gap (flush)', placement: { x: 10, y: 400, width: 1000, height: 540 }, expected: { x: 10, y: 20, width: 1000, height: 540 } },
  { name: 'a window one pixel taller than the host', placement: { x: 0, y: 0, width: 400, height: 561 }, expected: { x: 0, y: 0, width: 400, height: 560 } },
];

const placementsNotYetKnown: PlacementCase[] = [
  { name: 'nothing known yet', placement: {}, expected: { x: undefined, y: undefined, width: undefined, height: undefined } },
  { name: 'a position with no size yet (kept inside by its top-left corner)', placement: { x: 2000, y: -10 }, expected: { x: 1008, y: 16, width: undefined, height: undefined } },
  { name: 'CSS string values', placement: { x: '10%', y: '5%', width: '50%', height: '80%' }, expected: { x: '10%', y: '5%', width: '50%', height: '80%' } },
];

describe('keepWindowInsideHost', () => {
  it.each(placementsAlreadyInside)('leaves $name where it is', ({ placement, expected }) => {
    expect(keepWindowInsideHost(placement, HOST)).toEqual(expected);
  });

  it.each(placementsPartlyOutside)('brings $name wholly inside', ({ placement, expected }) => {
    expect(keepWindowInsideHost(placement, HOST)).toEqual(expected);
  });

  it.each(placementsNotYetKnown)('handles $name', ({ placement, expected }) => {
    expect(keepWindowInsideHost(placement, HOST)).toEqual(expected);
  });

  // Vision sc-3365: a '75%' window held at its 1230px min-width, remembered centred on a 1920 screen (x=227), reopened on a
  // 1366 one (host 1262 wide). Counting the CSS size as nothing left it at x=227, 195px off the right edge.
  const drawnCases: PlacementCase[] = [
    { name: 'a remembered CSS-sized window drawn wider than the room right of it', placement: { x: 227, y: 40, width: '75%', height: '85%', drawn: { width: 1230, height: 476 } }, expected: { x: 16, y: 40, width: '75%', height: '85%' } },
    { name: 'a CSS-sized window drawn taller than the room below it', placement: { x: 0, y: 300, width: '50%', height: '85%', drawn: { width: 500, height: 476 } }, expected: { x: 0, y: 68, width: '50%', height: '85%' } },
    { name: 'a CSS-sized window drawn wider than the host (flush left)', placement: { x: 120, y: 0, width: '75%', height: 300, drawn: { width: 1400, height: 300 } }, expected: { x: 0, y: 0, width: '75%', height: 300 } },
    { name: 'a CSS-sized window that fits where it is', placement: { x: 100, y: 20, width: '50%', height: '50%', drawn: { width: 512, height: 280 } }, expected: { x: 100, y: 20, width: '50%', height: '50%' } },
    { name: 'a CSS-sized window not drawn yet (kept inside by its corner)', placement: { x: 2000, y: 10, width: '75%', height: '85%' }, expected: { x: 1246, y: 10, width: '75%', height: '85%' } },
  ];

  it.each(drawnCases)('keeps $name inside by its drawn size', ({ placement, expected }) => {
    expect(keepWindowInsideHost(placement, LAPTOP_HOST)).toEqual(expected);
  });

  it.each([{ width: 0, height: 0 }, { width: 0, height: 560 }, { width: 1024, height: 0 }])('leaves the placement alone when the host is not laid out (%o)', host => {
    const placement = { x: -80, y: 3000, width: 1100, height: 720 };
    expect(keepWindowInsideHost(placement, host)).toBe(placement);
  });
});
