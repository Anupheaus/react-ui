import { FunctionComponent, ReactElement } from 'react';
import { IUseAsync, useAsync } from './useAsync';
import { mount } from 'enzyme';

interface IProps {
  data: any;
  children(state: IUseAsync): ReactElement;
}

const AsyncTestComponent: FunctionComponent<IProps> = ({ children, data }) => {
  const asyncState = useAsync(async () => {
    await Promise.delay(0);
    return data;
  }, []);
  return children(asyncState);
};

const SyncTestComponent: FunctionComponent<IProps> = ({ children, data }) => {
  const asyncState = useAsync(() => {
    return data;
  }, []);
  return children(asyncState);
};

function setupTest(data?: any, asyncTest: boolean = true) {
  const state: IUseAsync & {
    renderCount: number;
    dispose(): void;
  } = {
    renderCount: 0,
    onTokenCancelledCount: 0,
    dispose() {
      component.unmount();
    },
  } as any;

  const TestComponent = asyncTest ? AsyncTestComponent : SyncTestComponent;

  const component = mount((
    <TestComponent data={data}>
      {innerState => {
        state.renderCount++;
        Reflect.ownKeys(innerState).forEach(key => { state[key] = innerState[key]; });
        return null;
      }}
    </TestComponent>
  ));

  return state;
}

describe('useAsync', () => {

  it('returns everything it is supposed to do correctly', async () => {
    const { renderCount, error, isBusy, result, dispose } = setupTest();

    expect(error).to.be.undefined;
    expect(renderCount).to.eq(1);
    expect(isBusy).to.be.eq(true);
    expect(result).to.be.undefined;

    dispose();
  });

  it('can call an async function', async () => {
    const test = setupTest({ test: 1 });
    expect(test.renderCount).to.eq(1);

    await Promise.delay(10);

    expect(test.renderCount).to.eq(2);
    expect(test.result).to.eql({ test: 1 });

    test.dispose();
  });

  it('will not update if returned after unmounted', async () => {
    const test = setupTest({ test: 1 });
    expect(test.renderCount).to.eq(1);

    test.dispose();

    await Promise.delay(10);

    expect(test.renderCount).to.eq(1);
    expect(test.result).to.undefined;
  });

  it('works even when the return value is not a promise', async () => {
    const test = setupTest({ test: 1 }, false);
    expect(test.renderCount).to.eq(2); // the useEffect is synchronous so it actually happens before we get the component back
    expect(test.result).to.eql({ test: 1 });
    expect(test.isBusy).to.be.false;
  });

});
