import { useClasses } from './useClasses';

describe('useClasses', () => {

  it('can take an array of class names and return them all correctly as a single string', () => {
    const value = useClasses([
      'test1',
      'test2',
      'test3',
    ]);

    expect(value).to.eq('test1 test2 test3');
  });

  it('returns undefined if no values are specified or are empty', () => {
    const value = useClasses([
      '',
      undefined,
      null,
    ]);

    expect(value).to.be.undefined;
  });

});
