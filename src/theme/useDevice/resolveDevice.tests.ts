import { resolveDevice } from './resolveDevice';
import { mobileQuery, touchPointerQuery } from './deviceQueries';

// Builds a matcher that reports exactly the given queries as currently matching.
function matcherFor(...matchingQueries: string[]): (query: string) => boolean {
  const matching = new Set(matchingQueries);
  return query => matching.has(query);
}

describe('resolveDevice', () => {
  it('reports mobile when the narrow touch query matches', () => {
    expect(resolveDevice(matcherFor(touchPointerQuery, mobileQuery))).toBe('mobile');
  });

  it('reports tablet when only the coarse-pointer query matches', () => {
    expect(resolveDevice(matcherFor(touchPointerQuery))).toBe('tablet');
  });

  it('reports web when no touch query matches', () => {
    expect(resolveDevice(matcherFor())).toBe('web');
  });

  it('prioritises mobile over tablet for a phone, which matches both queries', () => {
    expect(resolveDevice(matcherFor(touchPointerQuery, mobileQuery))).toBe('mobile');
  });
});
