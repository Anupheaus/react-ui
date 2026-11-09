import { getNextRadioIndex } from './getNextRadioIndex';

describe('getNextRadioIndex', () => {
  it.each([
    ['ArrowDown', 0, 3, 1],
    ['ArrowRight', 1, 3, 2],
    ['ArrowDown', 2, 3, 0],
    ['ArrowUp', 1, 3, 0],
    ['ArrowLeft', 0, 3, 2],
    ['ArrowUp', 0, 1, 0],
  ])('%s from option %i of %i goes to %i', (key, currentIndex, count, expected) => {
    expect(getNextRadioIndex({ key, currentIndex, count })).toBe(expected);
  });

  it.each(['Tab', 'Enter', ' ', 'a', 'Home'])('does not move on %s', key => {
    expect(getNextRadioIndex({ key, currentIndex: 1, count: 3 })).toBeUndefined();
  });

  it('does not move when focus is not on an option or there are none', () => {
    expect(getNextRadioIndex({ key: 'ArrowDown', currentIndex: -1, count: 3 })).toBeUndefined();
    expect(getNextRadioIndex({ key: 'ArrowDown', currentIndex: 0, count: 0 })).toBeUndefined();
  });
});
