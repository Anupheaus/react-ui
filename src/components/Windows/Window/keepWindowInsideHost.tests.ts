import type { WindowPlacement } from './keepWindowInsideHost';
import { keepWindowInsideHost } from './keepWindowInsideHost';

const HOST = { width: 1024, height: 560 };

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

  it.each([{ width: 0, height: 0 }, { width: 0, height: 560 }, { width: 1024, height: 0 }])('leaves the placement alone when the host is not laid out (%o)', host => {
    const placement = { x: -80, y: 3000, width: 1100, height: 720 };
    expect(keepWindowInsideHost(placement, host)).toBe(placement);
  });
});
