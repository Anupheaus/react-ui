import { createDistributedState } from './createDistributedState';
import { render } from '@testing-library/react';
import { anuxPureFC } from '../anuxComponents';
import { DistributedStateChangeMeta } from './DistributedStateModels';

interface TestState {
  something: {
    more: {
      here: string;
    };
  };
}

interface GetStateProps {
  onState(state: TestState): void;
}

interface SetupTestProps {
  useStateProp?: boolean;
}

function setupTest({ useStateProp = false }: SetupTestProps = {}) {
  const { Provider, useProvider } = createDistributedState<TestState>();
  const testState: TestState = {
    something: {
      more: {
        here: 'test',
      },
    },
  };
  const newState: TestState = { ...testState, something: { ...testState.something, more: { ...testState.something.more, here: 'test2' } } };
  let currentState: TestState | undefined;
  let updatedStateCount = 0;
  let renderCount = 0;
  let set = undefined as unknown as ReturnType<typeof useProvider>['set'];

  const GetState = anuxPureFC<GetStateProps>('GetState', ({
    onState,
    children = null,
  }) => {
    const results = useProvider();
    if (useStateProp) onState(results.state);
    set = results.set;
    renderCount++;

    return <>{children}</>;
  });

  const providerOnChange = jest.fn();

  const generateContent = (state: TestState) => (
    <Provider state={state} onChange={providerOnChange}>
      <GetState onState={s => {
        updatedStateCount++;
        currentState = s;
      }} />
      Hey
    </Provider>
  );

  const { rerender, ...results } = render(generateContent(testState));

  const updateState = (updatedState: TestState) => rerender(generateContent(updatedState));

  return {
    ...results,
    testState,
    newState,
    getState() { return currentState; },
    getUpdatedStateCount() { return updatedStateCount; },
    getRenderCount() { return renderCount; },
    updateState,
    set,
    providerOnChange,
  };
}

describe('DistributedState', () => {

  describe('Provider', () => {

    it('correctly renders the children', () => {
      const { getByText } = setupTest({ useStateProp: true });
      expect(getByText('Hey')).toBeDefined();
    });

    it('correctly provides a context', () => {
      const { getState, getUpdatedStateCount, testState } = setupTest({ useStateProp: true });
      expect(getState()).toBe(testState);
      expect(getUpdatedStateCount()).toBe(1);
    });

    it('correctly updates the state if the state provided to the provider changes', () => {
      const { getState, getUpdatedStateCount, testState, newState, updateState, providerOnChange } = setupTest({ useStateProp: true });
      expect(getState()).toBe(testState);
      expect(getUpdatedStateCount()).toBe(1);
      expect(providerOnChange).not.toHaveBeenCalled();
      updateState(newState);
      expect(getState()).toStrictEqual(newState);
      expect(getUpdatedStateCount()).toBe(2);
      expect(providerOnChange).toHaveBeenNthCalledWith(1, newState, { reason: 'newProviderState' });
    });

    it('does not re-render the child if not watching state and the state is changed', () => {
      const { updateState, newState, getRenderCount } = setupTest({ useStateProp: false });
      expect(getRenderCount()).toBe(1);
      updateState(newState);
      expect(getRenderCount()).toBe(1);
    });

    it('re-renders if state is watched and state is changed via set', () => {
      const { updateState, newState, getRenderCount } = setupTest({ useStateProp: true });
      expect(getRenderCount()).toBe(1);

      expect(getRenderCount()).toBe(1);
    });

  });

});
