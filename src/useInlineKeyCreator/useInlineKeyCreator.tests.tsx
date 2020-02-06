import { mount, ReactWrapper } from 'enzyme';
import { ReactNode, useRef } from 'react';
import { anuxPureFC } from '../anuxComponents';
import { useSharedHookState } from '../useSharedHookState';
import { useInlineKeyCreator, CreateKeyType } from './useInlineKeyCreator';

describe('useInlineKeyCreator', () => {

  function createTest() {
    const result = {
      component: null as ReactWrapper,
      createKey: null as CreateKeyType,
      updateSuffix(_suffix: string): void { throw new Error('This should not have been called.'); },
    };

    const TestComponent = anuxPureFC('TestComponent', () => {
      const sharedHookState = useSharedHookState();
      const [createKey, suffixUpdater] = useInlineKeyCreator(sharedHookState);

      result.createKey = createKey;
      result.updateSuffix = suffixUpdater;

      return null;
    });

    result.component = mount(<TestComponent />);

    return result;
  }

  it('returns the same key if called with the same from', () => {
    const test = createTest();
    const keys = new Array(10).fill(0).map(() => test.createKey({ from: 'hey' }));
    expect(keys).to.be.an('array').with.lengthOf(10);
    keys.forEach(key => {
      expect(key).to.be.a('string').with.lengthOf(32);
      keys.forEach(otherKey => expect(key).to.eq(otherKey));
    });
    test.component.unmount();
  });

  it('returns a different key if called with different from values', () => {
    const test = createTest();
    const key1 = test.createKey({ from: 'a' });
    const key2 = test.createKey({ from: 'b' });
    expect(key1).to.be.a('string').with.lengthOf(32);
    expect(key2).to.be.a('string').with.lengthOf(32);
    expect(key2).not.to.eq(key1);
    test.component.unmount();
  });

  it('returns a different key if the suffix is changed but called using the same from value', () => {
    const test = createTest();
    const keys = new Array(10).fill(0).map((_, index) => {
      if (index === 5) { test.updateSuffix('something'); }
      return test.createKey({ from: 'a' });
    });
    expect(keys).to.be.an('array').with.lengthOf(10);
    keys.forEach(key => expect(key).to.be.a('string').with.lengthOf(32));
    keys.take(5).forEach(key => keys.take(5).forEach(otherKey => expect(key).to.eq(otherKey)));
    keys.skip(5).forEach(key => keys.skip(5).forEach(otherKey => expect(key).to.eq(otherKey)));
    keys.take(5).forEach(key => keys.skip(5).forEach(otherKey => expect(key).not.to.eq(otherKey)));
  });

  it('works regardless of how the surrounding code is called', () => {
    const keys: string[] = [];
    let invokeChildren: () => void;
    const SubComponent = anuxPureFC<{ children(): ReactNode }>('SubComponent', ({ children }) => {
      const renderedChildren = useRef<ReactNode>(null);
      invokeChildren = () => {
        renderedChildren.current = children();
      };

      return (
        <>
          {renderedChildren.current}
        </>
      );
    });

    const Component = anuxPureFC('Component', () => {
      const [createKey] = useInlineKeyCreator(useSharedHookState());
      const renderKey = () => {
        const key = createKey({ from: 'a' });
        keys.push(key);
        return key;
      };

      return (
        <SubComponent>
          {() => (
            <div>{renderKey()}</div>
          )}
        </SubComponent>
      );
    });

    const component = mount(<Component />);
    expect(keys).to.be.an('array').with.lengthOf(0);
    invokeChildren();
    expect(keys).to.be.an('array').with.lengthOf(1);
    invokeChildren();
    expect(keys).to.be.an('array').with.lengthOf(2);
    keys.forEach((key, index) => keys.forEach((otherKey, otherIndex) => index === otherIndex ? null : expect(key).to.eq(otherKey)));
    invokeChildren();
    expect(keys).to.be.an('array').with.lengthOf(3);
    keys.forEach((key, index) => keys.forEach((otherKey, otherIndex) => index === otherIndex ? null : expect(key).to.eq(otherKey)));
    component.unmount();
  });

});