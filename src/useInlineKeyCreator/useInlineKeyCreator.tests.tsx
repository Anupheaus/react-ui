import { anuxPureFunctionComponent } from "../anuxComponents";
import { mount, ReactWrapper } from 'enzyme';
import { useInlineKeyCreator } from './useInlineKeyCreator';
import { useSharedHookState } from '../useSharedHookState';

describe('useInlineKeyCreator', () => {

  function createTest() {
    const result = {
      component: null as ReactWrapper,
      createKey(): string { throw new Error('This should not have been called.'); },
      updateSuffix(_suffix: string): void { throw new Error('This should not have been called.'); },
    };

    const TestComponent = anuxPureFunctionComponent('TestComponent', () => {
      const sharedHookState = useSharedHookState();
      const [createKey, suffixUpdater] = useInlineKeyCreator(sharedHookState);

      result.createKey = createKey;
      result.updateSuffix = suffixUpdater;

      return null;
    });

    result.component = mount(<TestComponent />);

    return result;
  }

  it('returns the same key if called from the same place more than once', () => {
    const test = createTest();
    const keys = new Array(10).fill(0).map(() => test.createKey());
    expect(keys).to.be.an('array').with.lengthOf(10);
    keys.forEach(key => {
      expect(key).to.be.a('string').with.lengthOf(32);
      keys.forEach(otherKey => expect(key).to.eq(otherKey));
    });
    test.component.unmount();
  });

  it('returns a different key if called from different places', () => {
    const test = createTest();
    const key1 = test.createKey();
    const key2 = test.createKey();
    expect(key1).to.be.a('string').with.lengthOf(32);
    expect(key2).to.be.a('string').with.lengthOf(32);
    expect(key2).not.to.eq(key1);
    test.component.unmount();
  });

  it('returns a different key if the suffix is changed but called from the same place more than once', () => {
    const test = createTest();
    const keys = new Array(10).fill(0).map((_, index) => {
      if (index === 5) { test.updateSuffix('something'); }
      return test.createKey();
    });
    expect(keys).to.be.an('array').with.lengthOf(10);
    keys.forEach(key => expect(key).to.be.a('string').with.lengthOf(32));
    keys.take(5).forEach(key => keys.take(5).forEach(otherKey => expect(key).to.eq(otherKey)));
    keys.skip(5).forEach(key => keys.skip(5).forEach(otherKey => expect(key).to.eq(otherKey)));
    keys.take(5).forEach(key => keys.skip(5).forEach(otherKey => expect(key).not.to.eq(otherKey)));
  });

});