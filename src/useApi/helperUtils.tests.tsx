import { FunctionComponent, useState } from 'react';
import { saveToState } from './helperUtils';
import { useOnUnmount } from '../useOnUnmount';
import { mount } from 'enzyme';
import { useTimeout } from '../useTimeout';

describe('helperUtils', () => {

  describe('saveToState', () => {

    interface IState {
      something: string;
    }

    function createTest(setStateCalled?: () => void) {
      const TestComponent: FunctionComponent = () => {
        const [state, setState] = useState<IState>({
          something: '',
        });

        const isUnmountedRef = useOnUnmount();

        const setStateWrapper = (delegate: (state: IState) => IState) => {
          if (setStateCalled) { setStateCalled(); }
          setState(delegate);
        };

        useTimeout(() => {
          saveToState(setStateWrapper, 'something', isUnmountedRef)('hey');
        }, 1, { dependencies: [''] });

        return (
          <div>{state.something}</div>
        );
      };

      const component = mount((
        <TestComponent />
      ));
      return component;
    }

    it('can save to the state', async () => {
      let setStateCalled = 0;
      const component = createTest(() => { setStateCalled++; });
      await Promise.delay(4);
      expect(component.html()).to.eq('<div>hey</div>');
      expect(setStateCalled).to.eq(1);
      component.unmount();
    });

    it('is prevented from saving to state after unmounting', async () => {
      let setStateCalled = 0;
      const component = createTest(() => { setStateCalled++; });
      component.unmount();
      await Promise.delay(4);
      expect(setStateCalled).to.eq(0);
    });

  });

});
