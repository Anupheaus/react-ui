import { FunctionComponent, ReactElement } from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { useReusableDOMRef } from './useReusableDOMRef';
import { HTMLTargetDelegate } from './models';

interface IProps {
  something?: string;
  children(testTarget: (key: string, data: ITestData) => HTMLTargetDelegate): ReactElement;
}

interface ITestData {
  something: string;
}

function createTest(renderedChildren: (setTarget: (key: string, data: ITestData) => HTMLTargetDelegate) => ReactElement) {
  const state = {
    key: '',
    data: null as ITestData,
    element: undefined as HTMLElement,
    connectedCallCount: 0,
    disconnectedCallCount: 0,
    component: undefined as ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>,
    dispose: () => void 0,
  };

  const Component: FunctionComponent<IProps> = ({ children }) => {
    const testTarget = useReusableDOMRef<ITestData>({
      connected: (key, data, element) => { state.key = key; state.data = data; state.element = element; state.connectedCallCount++; },
      disconnected: (key, data) => { state.key = key; state.data = data; state.element = undefined; state.disconnectedCallCount++; },
    });
    return children(testTarget);
  };

  const component = mount((
    <Component>
      {renderedChildren}
    </Component>
  ));
  state.component = component;
  state.dispose = () => { component.unmount(); };

  return state;
}

describe('useReusableDOMRef', () => {

  it('can get a reference from an element', () => {
    const key = Math.uniqueId();
    const data: ITestData = {
      something: 'else',
    };
    const state = createTest(setTarget => (<div ref={setTarget(key, data)}></div>));
    expect(state).to.eql({
      ...state,
      key,
      data: { something: 'else' },
      connectedCallCount: 1,
      disconnectedCallCount: 0,
    });
    expect(state).to.have.property('element').and.not.to.be.undefined;
    state.dispose();
  });

  it('doesn\'t disconnect and reconnect when a force update is used and always returns the same setElement function', () => {
    const key = Math.uniqueId();
    const data: ITestData = { something: 'else' };
    let setElementFunc: HTMLTargetDelegate;
    const state = createTest(setTarget => {
      setElementFunc = setTarget(key, data);
      return (
        <div ref={setElementFunc}></div>
      );
    });
    expect(setElementFunc).to.be.a('function');
    const prevSetElementFunc = setElementFunc;
    state.component.setProps({ something: 'else' });
    expect(prevSetElementFunc).to.eq(setElementFunc);
    expect(state).to.eql({
      ...state,
      key,
      data: { something: 'else' },
      connectedCallCount: 1, // should still be 1
      disconnectedCallCount: 0,
    });
    expect(state).to.have.property('element').and.not.to.be.undefined;
    state.dispose();
  });

  it('calls disconnect when the child is removed', () => {
    const key = Math.uniqueId();
    const data: ITestData = { something: 'else' };
    const state = createTest(setTarget => (<div ref={setTarget(key, data)}></div>));
    state.component.setProps({ children: (() => null) });
    expect(state).to.eql({
      ...state,
      connectedCallCount: 1,
      disconnectedCallCount: 1,
    });
    state.dispose();
  });

  it('calls disconnect and re-connect when the child is changed', () => {
    const key = Math.uniqueId();
    const data: ITestData = { something: 'else' };
    const state = createTest(setTarget => (<div ref={setTarget(key, data)}></div>));
    state.component.setProps({ children: (setTarget: (key: string, data: ITestData) => HTMLTargetDelegate) => (<span ref={setTarget(key, data)}></span>) });
    expect(state).to.eql({
      ...state,
      connectedCallCount: 2,
      disconnectedCallCount: 1,
    });
    state.dispose();
  });

  it('calls through, but gets immediately returned because the elements are the same', () => {
    const key = Math.uniqueId();
    const data: ITestData = { something: 'else' };
    const state = createTest(setTarget => (<div ref={setTarget(key, data)} style={{ backgroundColor: 'blue' }}></div>));
    state.component.setProps({
      children: (setTarget: (key: string, data: ITestData) => HTMLTargetDelegate) => (
        <div ref={setTarget(key, data)} style={{ backgroundColor: 'red' }}></div>
      ),
    });
    expect(state).to.eql({
      ...state,
      connectedCallCount: 1,
      disconnectedCallCount: 0,
    });
    state.dispose();
  });

  // it('a forced update does not cause the child to re-render', () => {
  //   const key = Math.uniqueId();
  //   const data: ITestData = { something: 'else' };
  //   let renderCount = 0;
  //   const IncrementRenderCount: FunctionComponent<{ onRender(): void; }> = ({ onRender, children }) => {
  //     onRender();
  //     return (<>{children}</>);
  //   };
  //   const handleRender = () => { renderCount++; };
  //   const state = createTest(setTarget => (
  //     <IncrementRenderCount onRender={handleRender}>
  //       <div ref={setTarget(key, data)}></div>
  //     </IncrementRenderCount>
  //   ));
  //   expect(renderCount).to.eq(1);
  //   state.component.setProps({ something: 'boo' });
  //   expect(state).to.eql({
  //     ...state,
  //     connectedCallCount: 1,
  //     disconnectedCallCount: 0,
  //   });
  //   expect(renderCount).to.eq(1);
  //   state.dispose();
  // });

});
