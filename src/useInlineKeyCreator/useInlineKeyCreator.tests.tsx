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

  it('provides correct functionality', () => {
    const test = createTest();
    expect(test.createKey()).to.be.a('string').with.lengthOf(5);
    test.updateSuffix(':[something,1]');
    expect(test.createKey()).to.be.a('string').with.lengthOf(20);
    expect(test.createKey().endsWith(':[something,1]')).to.be.true;
    test.component.unmount();
  });

  it('returns the same key if called from the same place more than once', () => {
    const test = createTest();
    const createKey3 = () => test.createKey();
    const createKey2 = () => createKey3();
    const createKey = () => createKey2();
    const firstResult = createKey();
    const secondResult = createKey();
    expect(firstResult).to.eq(secondResult);
    test.component.unmount();
  });

  it('returns a different key if called from different places', () => {
    const test = createTest();
    const createKey2 = () => test.createKey();
    const createKey = () => createKey2();
    const firstResult = createKey();
    const secondResult = createKey();
    expect(firstResult).not.to.eq(secondResult);
    test.component.unmount();
  });

});