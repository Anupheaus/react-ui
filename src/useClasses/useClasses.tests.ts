import { useClasses } from './useClasses';

describe('useClasses', () => {

  it('can take an array of class names and return them all correctly as a single string', () => {
    const join = useClasses();

    expect(join('test1', 'test2', 'test3')).to.eq('test1 test2 test3');
  });

  it('returns undefined if no values are specified or are empty', () => {
    const join = useClasses();

    expect(join('', undefined, null)).to.be.undefined;
  });

});
